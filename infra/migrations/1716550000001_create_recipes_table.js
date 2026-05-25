/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  // A utilização do tipo JSONB para 'ingredients' e 'instructions' é ideal no conceito de Caderno Vivo.
  // Permite que a estrutura interna de cada ingrediente (ex: quantidade, unidade, nome) 
  // possa evoluir de arrays simples para objetos complexos sem a necessidade de reestruturação das tabelas relacionais.
  pgm.createTable('recipes', {
    id: { 
      type: 'uuid', 
      primaryKey: true, 
      default: pgm.func('gen_random_uuid()') 
    },
    title: { 
      type: 'varchar(255)', 
      notNull: true 
    },
    ingredients: { 
      type: 'jsonb', 
      notNull: true 
    },
    instructions: { 
      type: 'jsonb', 
      notNull: true 
    },
    created_at: {
      type: 'timestamp with time zone',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp with time zone',
      notNull: true,
      default: pgm.func('current_timestamp'),
    }
  });
};

exports.down = (pgm) => {
  pgm.dropTable('recipes');
};
