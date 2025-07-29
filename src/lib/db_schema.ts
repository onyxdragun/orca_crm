// Database table and field definitions for MariaDB CRM

export const CUSTOMER_TABLE = 'customer';
export const CUSTOMER_FIELDS = {
  id: 'id',
  firstName: 'first_name',
  lastName: 'last_name',
  email: 'email',
  unit: 'unit',
  street: 'street',
  city: 'city',
  postalCode: 'postal_code',
  phoneNumber: 'phone_number',
  status: 'status',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
};

export const CUSTOMER_STATUS = ['lead', 'current', 'inactive'] as const;

// SQL for creating the customer table
export const CREATE_CUSTOMER_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS customer (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  unit VARCHAR(50),
  street VARCHAR(100),
  city VARCHAR(100),
  postal_code VARCHAR(20),
  phone_number VARCHAR(50),
  status ENUM('lead', 'current', 'inactive') DEFAULT 'lead',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
`;

export const TICKET_TABLE = 'ticket';
export const TICKET_FIELDS = {
  id: 'id',
  customerId: 'customer_id',
  subject: 'subject',
  description: 'description',
  priority: 'priority',
  ticketNumber: 'ticket_number',
  status: 'status',
  completedAt: 'completed_at', // Added completed_at field
  ticketTypeId: 'ticket_type_id',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
};

export const TICKET_STATUS = ['open', 'pending', 'closed'] as const;

export const CREATE_TICKET_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS ticket (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  subject VARCHAR(255) NOT NULL,
  description TEXT,
  priority ENUM('low', 'normal', 'high') DEFAULT 'normal',
  ticket_number VARCHAR(20) UNIQUE,
  status ENUM('open', 'pending', 'closed') DEFAULT 'open',
  completed_at DATETIME NULL,
  ticket_type_id INT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customer(id) ON DELETE CASCADE,
  FOREIGN KEY (ticket_type_id) REFERENCES ticket_type(id)
);
`;

export const WORKLOG_TABLE = 'ticket_worklog';
export const WORKLOG_FIELDS = {
  id: 'id',
  ticketId: 'ticket_id',
  description: 'description',
  hours: 'hours',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
};

export const CREATE_WORKLOG_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS ticket_worklog (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ticket_id INT NOT NULL,
  description TEXT,
  hours DECIMAL(5,2) DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (ticket_id) REFERENCES ticket(id) ON DELETE CASCADE
);
`;

export const TICKET_TYPE_TABLE = 'ticket_type';
export const TICKET_TYPE_FIELDS = {
  id: 'id',
  name: 'name',
  description: 'description',
};

export const CREATE_TICKET_TYPE_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS ticket_type (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description VARCHAR(255)
);
`;

export const TASK_TYPE_TABLE = 'task_type';
export const TASK_TYPE_FIELDS = {
  id: 'id',
  name: 'name',
  description: 'description',
};

export const CREATE_TASK_TYPE_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS task_type (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description VARCHAR(255)
);
`;

export const TICKET_TASK_TABLE = 'ticket_task';
export const TICKET_TASK_FIELDS = {
  id: 'id',
  ticketId: 'ticket_id',
  taskTypeId: 'task_type_id',
  taskDescription: 'task_description',
  minutes: 'minutes', // Only minutes for time tracking
  status: 'status',
  notes: 'notes',
  completedAt: 'completed_at', // Added completed_at field
  createdAt: 'created_at',
  updatedAt: 'updated_at',
};

export const TASK_STATUS = ['Not Started', 'In Progress', 'Completed', 'Blocked'] as const;

export const CREATE_TICKET_TASK_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS ticket_task (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ticket_id INT NOT NULL,
  task_type_id INT,
  task_description TEXT,
  minutes INT DEFAULT 0, -- Only minutes for time tracking
  status ENUM('Not Started', 'In Progress', 'Completed', 'Blocked') DEFAULT 'Not Started',
  notes TEXT,
  completed_at DATETIME DEFAULT NULL, -- Added completed_at field
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (ticket_id) REFERENCES ticket(id) ON DELETE CASCADE,
  FOREIGN KEY (task_type_id) REFERENCES task_type(id)
);
`;

export const DEVICE_TYPE_TABLE = 'device_type';
export const DEVICE_TYPE_FIELDS = {
  id: 'id',
  name: 'name',
};

export const CREATE_DEVICE_TYPE_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS device_type (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);
`;

export const CUSTOMER_DEVICE_TABLE = 'customer_device';
export const CUSTOMER_DEVICE_FIELDS = {
  equipmentId: 'equipment_id',
  customerId: 'customer_id',
  deviceTypeId: 'device_type_id',
  brandModel: 'brand_model',
  serialNumber: 'serial_number',
  firstServiceDate: 'first_service_date',
  lastServiceDate: 'last_service_date',
  notes: 'notes',
};

export const CREATE_CUSTOMER_DEVICE_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS customer_device (
  equipment_id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  device_type_id INT NOT NULL,
  brand_model VARCHAR(100),
  serial_number VARCHAR(100),
  first_service_date DATETIME,
  last_service_date DATETIME,
  notes TEXT,
  custody_status ENUM('with_customer', 'in_service', 'awaiting_pickup', 'delivered') DEFAULT 'with_customer',
  custody_changed_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customer(id),
  FOREIGN KEY (device_type_id) REFERENCES device_type(id)
);
`;

export const CREATE_ALL_TABLES_SQL = `
CREATE TABLE IF NOT EXISTS customer (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  unit VARCHAR(50),
  street VARCHAR(100),
  city VARCHAR(100),
  postal_code VARCHAR(20),
  phone_number VARCHAR(50),
  status ENUM('lead', 'current', 'inactive') DEFAULT 'lead',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS task_type (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS ticket (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  subject VARCHAR(255) NOT NULL,
  description TEXT,
  priority ENUM('low', 'normal', 'high') DEFAULT 'normal',
  ticket_number VARCHAR(20) UNIQUE,
  status ENUM('open', 'pending', 'closed') DEFAULT 'open',
  completed_at DATETIME NULL,
  ticket_type_id INT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customer(id) ON DELETE CASCADE,
  FOREIGN KEY (ticket_type_id) REFERENCES ticket_type(id)
);

CREATE TABLE IF NOT EXISTS ticket_task (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ticket_id INT NOT NULL,
  task_type_id INT,
  task_description TEXT,
  minutes INT DEFAULT 0, -- Only minutes for time tracking
  status ENUM('Not Started', 'In Progress', 'Completed', 'Blocked') DEFAULT 'Not Started',
  notes TEXT, -- Added notes field
  completed_at DATETIME DEFAULT NULL, -- Added completed_at field
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (ticket_id) REFERENCES ticket(id) ON DELETE CASCADE,
  FOREIGN KEY (task_type_id) REFERENCES task_type(id)
);

CREATE TABLE IF NOT EXISTS ticket_worklog (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ticket_id INT NOT NULL,
  description TEXT,
  hours DECIMAL(5,2) DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (ticket_id) REFERENCES ticket(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS device_type (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS customer_device (
  equipment_id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  device_type_id INT NOT NULL,
  brand_model VARCHAR(100),
  serial_number VARCHAR(100),
  first_service_date DATETIME,
  last_service_date DATETIME,
  notes TEXT,
  custody_status ENUM('with_customer', 'in_service', 'awaiting_pickup', 'delivered') DEFAULT 'with_customer',
  custody_changed_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customer(id),
  FOREIGN KEY (device_type_id) REFERENCES device_type(id)
);
`;
