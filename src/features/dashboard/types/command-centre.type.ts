export interface CommandCentreApplication {
  id: string;
  name: string;
  emoji: string;

  health: {
    status: string;
    application: string;
    database: string;
    version: string;
    timestamp: string;
    uptime: number;
  };

  stats: {
    application: {
      name: string;
      type: string;
    };

    products: {
      total: number;
      active: number;
      inactive: number;
    };

    categories: {
      total: number;
    };

    images: {
      total: number;
    };

    reviews: {
      total: number;
      averageRating: number;
    };

    orders: {
      total: number;
      pending: number;
      completed: number;
      cancelled: number;
    };

    payments: {
      total: number;
      success: number;
      failed: number;
    };

    favorites: {
      total: number;
    };

    latest: {
      product: string;
      review: string;
      order: string;
    };
  };

  monitoring: {
    application: string;

    node: {
      version: string;
      uptime: number;
      platform: string;
      environment: string;
    };

    memory: {
      rss: number;
      heapTotal: number;
      heapUsed: number;
      external: number;
    };

    database: {
      status: string;
      latency: number;
    };

    response: {
      generatedAt: string;
    };
  };

  activities: {
    id: string;
    type: string;
    entity: string;
    title: string;
    description: string;
    createdAt: string;
    application: string;
  }[];

  orders: any[];

  reviews: any[];

  favorites: any[];

  cart: any[];

  payments: any[];

  orderStatusHistory: any[];
}
