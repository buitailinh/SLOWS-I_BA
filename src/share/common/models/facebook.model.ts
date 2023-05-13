export interface IFacebook {
  id: string;
  first_name: string;
  last_name: string;
  address: string;
  email?: string;
  about?: string;
  picture?: {
    data: {
      url: string;
    };
  };
}
export interface IFacebookAppFriends {
  context: {
    friends_using_app: {
      data: [
        {
          id: string;
        },
      ];
      paging: {
        cursors: {
          after: string;
        };
      };
      summary: {
        total_count: number;
      };
    };
    id: string;
  };
}
export interface IFacebookDebug {
  data: {
    app_id: string;
    type: string;
    application: string;
    data_access_expires_at: number;
    expires_at: number;
    is_valid: boolean;
    scopes: string [];
    user_id: string;
  }
}
