// Auth Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'engineering' | 'approver' | 'operations' | 'admin';
  avatar?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  salePrice: number;
  costPrice: number;
  version: string;
  status: 'active' | 'archived';
  description?: string;
  sku?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest extends Omit<Product, 'id' | 'createdAt' | 'updatedAt'> {}

// BOM Types
export interface BOMMaterial {
  id?: string;
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
}

export interface BOMOperation {
  id?: string;
  name: string;
  duration: number;
  workCenter: string;
}

export interface BOM {
  id: string;
  name: string;
  productId: string;
  productName: string;
  version: string;
  materials: BOMMaterial[];
  operations: BOMOperation[];
  status: 'active' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface CreateBOMRequest extends Omit<BOM, 'id' | 'createdAt' | 'updatedAt'> {}

// ECO Types
export interface ECOChange {
  type: 'added' | 'removed' | 'modified';
  field: string;
  oldValue?: string | number;
  newValue?: string | number;
}

export interface ECO {
  id: string;
  number: string;
  type: 'product' | 'bom';
  productId?: string;
  bomId?: string;
  status: 'new' | 'approval' | 'done';
  effectiveDate: string;
  versionUpdate: boolean;
  changes: ECOChange[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  approvals?: ECOApproval[];
}

export interface ECOApproval {
  id: string;
  ecoId: string;
  approverRole: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedAt?: string;
  comments?: string;
}

export interface CreateECORequest {
  type: 'product' | 'bom';
  productId?: string;
  bomId?: string;
  effectiveDate: string;
  versionUpdate: boolean;
  changes: ECOChange[];
}

// UI Component Types
export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface PageMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PageMeta;
}
