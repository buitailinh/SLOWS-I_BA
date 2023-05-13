import { User } from 'src/api/user/user.entity';
import { async } from '@firebase/util';
import { Injectable } from '@nestjs/common';
import { Database, getDatabase, Reference } from 'firebase-admin/database';
import { App, initializeApp, cert, ServiceAccount } from 'firebase-admin/app';
import * as serviceAccount from './configs/serviceAccountKey.json';
import admin from 'firebase-admin';

@Injectable()
export class FirebaseDatabaseService {
  public database: Database;

  constructor() {
    const app: App = initializeApp({
      credential: cert(serviceAccount as ServiceAccount),
      databaseURL: "https://test-data-afb93-default-rtdb.asia-southeast1.firebasedatabase.app"
    });

    this.database = getDatabase(app);
  }

  getNodeReference(nodePath: string): Reference {
    return this.database.ref(nodePath);
  }

  async likePost(post, user) {
    const likesRef = this.getNodeReference(`/notification/${post.author}`);

    // Kiểm tra xem đã có bản ghi với userId và postId đã cho chưa
    const snapshot = await likesRef.orderByChild('postId').equalTo(post._id.toString()).once('value');
    const records = snapshot.val();

    if (records) {
      for (const key in records) {
        if (records[key].userId === user._id.toString() && records[key].delete !== true) {
          // Cập nhật trạng thái 'delete' thành 'true'
          await likesRef.child(`${key}/delete`).set(true);
        }
      }
    } else {
      const newLikeRef = likesRef.push();

      await newLikeRef.set({
        postId: post._id.toString(),
        userId: user._id.toString(),
        photo: post.images[0],
        fullname: user.firstName + ' ' + user.lastName,
        avatar: user.avatar ? user.avatar : null,
        timestamp: admin.database.ServerValue.TIMESTAMP,
        read: false,
        type: 'like',
        delete: false
      });
    }
  }

  async commentPost(post, user) {
    const commentRef = this.getNodeReference(`/notification/${post.author}`);

    const newCommentRef = commentRef.push();

    await newCommentRef.set({
      postId: post._id.toString(),
      userId: user._id.toString(),
      photo: post.images[0],
      fullname: user.firstName + ' ' + user.lastName,
      avatar: user.avatar ? user.avatar : null,
      timestamp: admin.database.ServerValue.TIMESTAMP,
      read: false,
      type: 'comment',
      delete: false
    });
  }

  async remindYouPost(post, user, userRemind) {
    const remindRef = this.getNodeReference(`/notification/${userRemind._id}`);
    const newRemindRef = remindRef.push();

    await newRemindRef.set({
      postId: post._id.toString(),
      userId: user._id.toString(),
      photo: post.images[0],
      fullname: user.firstName + ' ' + user.lastName,
      avatar: user.avatar ? user.avatar : null,
      timestamp: admin.database.ServerValue.TIMESTAMP,
      read: false,
      type: 'remind',
      delete: false
    });
  }

  async followUser(userSend: User, userReceive: User, status: string) {
    const followRef = this.getNodeReference(`/notification/${userReceive._id}`);

    try {
      const newFollowRef = followRef.push();
      await newFollowRef.set({
        userSend: userSend._id.toString(),
        fullname: userSend.firstName + ' ' + userSend.lastName,
        photo: userSend.avatar ? userSend.avatar : '',
        timestamp: admin.database.ServerValue.TIMESTAMP,
        status: status,
        read: false,
        type: 'follow',
        delete: false
      })
    } catch (error) {
      console.log('error', error);
    }

  }

  async updateNotificationsToRead(userId) {
    const notificationsRef = this.getNodeReference(`/notification/${userId}`);
    const snapshot = await notificationsRef.orderByChild('read')
      .equalTo(false).once('value');
    const notifications = snapshot.val();
    const updates = {};

    for (const key in notifications) {
      updates[`/${key}/read`] = true;
    }

    await notificationsRef.update(updates);
  }

}

