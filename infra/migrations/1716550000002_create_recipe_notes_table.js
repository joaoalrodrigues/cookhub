/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  // Tabela para as Notas Contextuais (Caderno Vivo).
  // Utilizamos 'anchor_type' e 'anchor_index' em vez de uma modelagem chave-valor fixa
  // para permitir que os usuários façam anotações atreladas diretamente 
  // à posição (index) de um ingrediente ou instrução, mantendo o vínculo contextual sem inflar o JSONB.
  pgm.createTable('recipe_notes', {
    id: { 
      type: 'uuid', 
      primaryKey: true, 
      default: pgm.func('gen_random_uuid()') 
    },
    recipe_id: {
      type: 'uuid',
      notNull: true,
      references: '"recipes"',
      onDelete: 'CASCADE'
    },
    anchor_type: { 
      type: 'varchar(50)',  // Ex: 'ingredient', 'instruction'
      notNull: true 
    },
    anchor_index: { 
      type: 'integer', // Posição do item no respectivo array JSONB
      notNull: true 
    },
    content: { 
      type: 'text', 
      notNull: true 
    },
    created_at: {
      type: 'timestamp with time zone',
      notNull: true,
      default: pgm.func('current_timestamp'),
    }
  });

  // Opcional, porém recomendado em produção: criar índice para buscar facilmente as notas atreladas à receita.
  pgm.createIndex('recipe_notes', 'recipe_id');
};

exports.down = (pgm) => {
  pgm.dropTable('recipe_notes');
};
