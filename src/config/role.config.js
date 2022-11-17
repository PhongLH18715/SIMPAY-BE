const authorities = {
  admin: [
    'MANAGE_ALL_AGENT',
    'MANAGE_ALL_PRODUCT',
    'MANAGE_ALL_BRAND',

    'ADD_ORDER',
    'UPDATE_ORDER',
    'DELETE_ORDER',

    'ADD_COMMENT',
    'UPDATE_COMMENT',
    'DELETE_COMMENT',
    'DELETE_AGENT_COMMENT',
    'DELETE_SHIPPER_COMMENT'
  ],
  agent: [
    'MANAGE_ALL_SHIPPER',

    'MANAGE_ALL_PRODUCT',
    'MANAGE_ALL_BRAND',

    'ADD_ORDER',
    'UPDATE_ORDER',
    'DELETE_ORDER',

    'ADD_COMMENT',
    'UPDATE_COMMENT',
    'DELETE_COMMENT',
    'DELETE_SHIPPER_COMMENT'
  ],
  shipper: [
    'UPDATE_ORDER',
    'ACCEPT_ORDER',

    'ADD_COMMENT',
    'UPDATE_COMMENT',
    'DELETE_COMMENT',
  ],
}

const roleConfig = Object.keys(authorities);

const PERMISSIONS = new Map(Object.entries(authorities));

module.exports = {
  ROLES: roleConfig,
  PERMISSIONS,
  TYPES: ['admin', 'agent', 'shipper']
}
