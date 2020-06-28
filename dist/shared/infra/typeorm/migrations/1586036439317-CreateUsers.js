"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _typeorm = require("typeorm");

class CreateUsers1586036439317 {
  async up(queryRunner) {
    await queryRunner.createTable(new _typeorm.Table({
      name: 'users',
      columns: [{
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        generationStrategy: 'uuid',
        default: 'uuid_generate_v4()'
      }, {
        name: 'name',
        type: 'varchar',
        isNullable: false
      }, {
        name: 'email',
        type: 'varchar',
        isNullable: false,
        isUnique: true
      }, {
        name: 'password',
        type: 'varchar',
        isNullable: false
      }, {
        name: 'created_at',
        type: 'timestamp with time zone',
        default: 'now()'
      }, {
        name: 'updated_at',
        type: 'timestamp with time zone',
        default: 'now()'
      }]
    }));
    await queryRunner.createIndex('users', new _typeorm.TableIndex({
      name: 'IDX_NAME_DOMAIN',
      columnNames: ['name']
    }));
  }

  async down(queryRunner) {
    await queryRunner.dropIndex('users', 'IDX_NAME_DOMAIN');
    await queryRunner.dropTable('users');
  }

}

exports.default = CreateUsers1586036439317;