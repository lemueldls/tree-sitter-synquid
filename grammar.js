export default grammar({
  name: 'synquid',

  word: ($) => $.variable,

  extras: ($) => [/\s/, $.comment_line, $.comment_block],

  rules: {
    source_file: ($) => repeat($.declaration),

    declaration: ($) =>
      prec(
        -1,
        choice(
          $.type_alias,
          $.data_declaration,
          $.measure_declaration,
          $.predicate_declaration,
          $.qualifier_declaration,
          $.mutual_declaration,
          $.inline_declaration,
          $.function_signature,
          $.function_definition,
        ),
      ),

    type_alias: ($) =>
      prec(
        -1,
        seq('type', field('name', $.constructor), repeat($.variable), '=', $.body),
      ),

    data_declaration: ($) =>
      prec(
        -1,
        seq(
          'data',
          field('name', $.constructor),
          $.body,
          optional('where'),
          repeat($.constructor_case),
        ),
      ),

    constructor_case: ($) => prec(1, seq($.constructor, '::', $.body)),

    measure_declaration: ($) =>
      prec(
        -1,
        seq(
          optional('termination'),
          'measure',
          field('name', $.variable),
          optional(seq('::', $.body)),
          optional('where'),
          repeat($.measure_case),
        ),
      ),

    measure_case: ($) =>
      prec(
        1,
        seq(choice($.constructor, $.wildcard), repeat($.variable), '->', $.body),
      ),

    predicate_declaration: ($) =>
      prec(-1, seq('predicate', field('name', $.variable), '::', $.body)),

    qualifier_declaration: ($) =>
      prec(-1, seq('qualifier', '{', $.container_body, '}')),

    mutual_declaration: ($) =>
      prec(
        -1,
        seq('mutual', '{', repeat(seq(optional(','), field('name', $.variable))), '}'),
      ),

    inline_declaration: ($) =>
      prec(
        -1,
        seq('inline', field('name', $.variable), repeat($.variable), '=', $.body),
      ),

    function_signature: ($) => prec(-1, seq(field('name', $.variable), '::', $.body)),

    function_definition: ($) => prec(-1, seq(field('name', $.variable), '=', $.body)),

    let_expression: ($) =>
      prec(-1, seq('let', repeat($.let_binding), 'in', $.body)),

    let_binding: ($) => prec(-1, seq(field('name', $.variable), '=', $.body)),

    match_expression: ($) =>
      prec.right(seq('match', $.body, 'with', repeat($.match_case))),

    match_case: ($) =>
      prec(
        1,
        seq(choice($.constructor, $.wildcard), repeat($.variable), '->', $.body),
      ),

    if_expression: ($) =>
      prec(-1, seq('if', $.body, 'then', $.body, 'else', $.body)),

    lambda: ($) =>
      prec(
        -1,
        seq('\\', repeat1(choice($.variable, $.wildcard)), '.', $.body),
      ),

    paren: ($) => prec(-1, seq('(', optional($.container_body), ')')),

    bracket: ($) => prec(-1, seq('[', optional($.container_body), ']')),

    brace: ($) => prec(-1, seq('{', optional($.container_body), '}')),

    body: ($) => prec(-1, repeat1($.expression)),

    container_body: ($) =>
      prec(-1, repeat1(choice($._atom_in, $.expression))),

    expression: ($) =>
      prec(
        -1,
        choice(
          $.paren,
          $.bracket,
          $.brace,
          $.match_expression,
          $.let_expression,
          $.if_expression,
          $.lambda,
          $._atom,
        ),
      ),

    // Lexical tokens. Order matters for equal-length ties: keyword literals and
    // special variables must precede the generic identifier tokens.
    _atom: ($) =>
      choice(
        'error',
        'True',
        'False',
        'Bool',
        'Int',
        'Set',
        '::',
        '->',
        '=',
        '.',
        '|',
        ',',
        '<',
        '>',
        $.special_var,
        $.special_index,
        $.wildcard,
        $.variable,
        $.constructor,
        $.integer,
        $.operator,
        $.hole,
      ),

    // `in` is a word operator inside refinement formulas (set membership), but
    // must not be swallowed by bodies of `let ... in`. Only container bodies
    // (braces/parens/brackets) may lex it.
    _atom_in: ($) => choice('in', $._atom),

    comment_line: ($) => token(/--[^\n]*/),

    comment_block: ($) => token(/\{-([^-]|-[^}])*-\}/),

    // Token rules are created in rules-object order; special variables must
    // precede `variable`/`constructor` so that equal-length ties at `_v`
    // resolve to special_var.
    special_var: ($) => /_v/,

    special_index: ($) => /_[0-9]+/,

    wildcard: ($) => /_/,

    variable: ($) => /_[a-z][A-Za-z0-9_']*|[a-z][A-Za-z0-9_']*/,

    constructor: ($) => /[A-Z][A-Za-z0-9_']*/,

    integer: ($) => /\d+/,

    operator: ($) => /==>|<==>|&&|\|\||==|!=|<=|>=|!|\*|\+|-|:/,

    hole: ($) => /\?\?/,
  },
});
