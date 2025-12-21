// Unfathomable Disgust:
//
// I asked AI to create something unreasonable, to build this, something that would probably take me months to do
// and it did it nearly instantly, and I am constantly having this experience over and over, and
// it's soul crushing.  The code works, and I have to accept that it's very useful, works very well
// for what I need it for, and is likely better than anything I could've done on my own.  I hate this.
// It used to be that midwit intelligence was valuable on its own, and prior to that -- a tolerance for repetition,
// and before that mediocre brawn.  If the action of creation outside of genius itself now has so little value, and such
// grandure can be created on demand, we are inventing a problem so profoundly unsettling that it questions
// the entire future of humanity, both in physical and spiritual terms.  Only in ignorance, can you look
// at this, the result of one single prompt, and find a future where falcification of importance isn't
// a feigned exercise for the self-aware.  This code is despair, but despair is the newest tooling, and to not use
// the tooling available is even more foolish than acceptance.
//
// I didn't design the CPU, and yet I use the CPU.  The only rational thought I have now, is that AI
// is just another instance of utilizing tools I have not created, to bring forward ideas.  I used to
// write all the code by hand, hundreds of thousands of lines.  Perhaps my purpose now is to sow together
// the thousands, like a quiltmaker, rather than a fabricator.  Soon even that will be dominated by some
// mechanical intelligence, but for now I can express my designs in that way.  What a strange experience.
//
// Use Case:
// The use case I have for this code, is to be able to pre-verify SQL queries in the case of a schema
// change to identify potentially bad or outdated queries quickly.  The idea is to pre-register queries,
// and run them through the validator with a provided schema snapshot to detect likely code issues.  This
// is my attempt to bridge some of the functionality of an ORM without the layers of obfuscation that an
// ORM performs.  I truly believe that when dealing with SQL, you should just write SQL, this allows for
// that without having to need a generator layer (eg Prisma).  Things like Drizzle try to just turn SQL thought
// patterns into javascript, and then back into SQL, but to me that is supremely flawed as it's just another
// layer on top of SQL.  This code lets us just write the damn sql and verify via initialization that the queries
// appear correct for the database they're being utilized on.
//
// Supported (SELECT):
//   - SELECT <expr_list> FROM <table> [AS alias] [JOIN <table> [AS alias] ON <expr>]...
//   - Optional WHERE, GROUP BY, HAVING, ORDER BY, LIMIT
//   - SELECT * and t.*
// Unsupported (explicit error):
//   - WITH/CTE, UNION, derived tables/subqueries, comma joins, JOIN ... USING
//   - INSERT ... SELECT
//   - UPDATE ... JOIN, DELETE multi-table
//

import type {
  schema_snapshot_t,
  table_schema_t
} from './MariaDBDatabaseSchemaIntrospector.class';

/* ----------------------------- public result types ----------------------------- */

export type query_kind_t =
  | 'select'
  | 'insert'
  | 'update'
  | 'delete'
  | 'unknown';

export type validation_error_t = {
  code:
    | 'unsupported_query'
    | 'parse_error'
    | 'unknown_table'
    | 'unknown_column'
    | 'ambiguous_column'
    | 'invalid_qualifier'
    | 'values_count_mismatch'
    | 'missing_set_clause'
    | 'missing_values_clause'
    | 'missing_table'
    | 'invalid_syntax';
  message: string;
  position?: number; // token index
};

export type validation_warning_t = {
  code:
    | 'no_column_list'
    | 'where_not_present'
    | 'unvalidated_expression'
    | 'ignored_qualified_db'
    | 'partial_support';
  message: string;
  position?: number;
};

export type validation_result_t = {
  ok: boolean;
  kind: query_kind_t;
  errors: validation_error_t[];
  warnings: validation_warning_t[];
};

export type validator_options_t = {
  // Expression identifier extraction is heuristic.
  // If true: unknown identifiers in expression contexts become errors.
  // If false: unknown identifiers in expression contexts become warnings.
  strict_expression_identifiers?: boolean;
};

/* ------------------------------ tokenizer types ------------------------------ */

type token_kind_t =
  | 'ident'
  | 'keyword'
  | 'string'
  | 'number'
  | 'punct'
  | 'operator'
  | 'eof';

type token_t = {
  kind: token_kind_t;
  value: string;
  pos: number;
};

type token_stream_t = {
  tokens: token_t[];
  i: number;
};

/* --------------------------------- ast types -------------------------------- */

type qualified_table_name_t = {
  db: string | null;
  table: string;
  alias: string | null;
};

type column_ref_t = {
  qualifier: string | null;
  name: string;
  pos: number;
};

type star_ref_t = {
  kind: 'star';
  qualifier: string | null;
  pos: number;
};

type expr_span_t = {
  start_pos: number;
  end_pos: number;
};

type join_clause_t = {
  join_type:
    | 'join'
    | 'left join'
    | 'right join'
    | 'inner join'
    | 'outer join'
    | 'cross join';
  table: qualified_table_name_t;
  on_span: expr_span_t | null;
};

type from_source_t = {
  table: qualified_table_name_t;
  joins: join_clause_t[];
};

type select_ast_t = {
  kind: 'select';
  select_expr_spans: expr_span_t[];
  from_sources: from_source_t[];
  where_span: expr_span_t | null;
  group_by_spans: expr_span_t[] | null;
  having_span: expr_span_t | null;
  order_by_spans: expr_span_t[] | null;
  limit_span: expr_span_t | null;

  select_column_refs: column_ref_t[];
  select_star_refs: star_ref_t[];

  where_column_refs: column_ref_t[];
  join_on_column_refs: column_ref_t[];
  group_by_column_refs: column_ref_t[];
  having_column_refs: column_ref_t[];
  order_by_column_refs: column_ref_t[];
};

type insert_ast_t = {
  kind: 'insert';
  target: qualified_table_name_t;
  mode: 'values' | 'set';
  columns: string[] | null;
  values_rows: expr_span_t[][] | null;
  set_pairs: { column: column_ref_t; value: expr_span_t }[] | null;
};

type update_ast_t = {
  kind: 'update';
  target: qualified_table_name_t;
  set_pairs: { column: column_ref_t; value: expr_span_t }[];
  where_span: expr_span_t | null;
  where_column_refs: column_ref_t[];
};

type delete_ast_t = {
  kind: 'delete';
  target: qualified_table_name_t;
  where_span: expr_span_t | null;
  where_column_refs: column_ref_t[];
};

type parsed_query_ast_t =
  | select_ast_t
  | insert_ast_t
  | update_ast_t
  | delete_ast_t;

/* --------------------------------- utilities -------------------------------- */

const keyword_set = new Set<string>([
  'select',
  'distinct',
  'all',
  'insert',
  'into',
  'values',
  'value',
  'set',
  'update',
  'delete',
  'from',
  'where',
  'as',
  'and',
  'or',
  'not',
  'null',
  'default',
  'returning',
  'on',
  'join',
  'left',
  'right',
  'inner',
  'outer',
  'cross',
  'using',
  'limit',
  'order',
  'by',
  'group',
  'having',
  'union',
  'with'
]);

function is_keyword(v: string): boolean {
  return keyword_set.has(v.toLowerCase());
}

function normalize_ident(v: string): string {
  return v;
}

function is_name_token(t: token_t): boolean {
  return t.kind === 'ident' || t.kind === 'keyword';
}

function token_is(
  t: token_t,
  kind: token_kind_t,
  value_lower?: string
): boolean {
  if (t.kind !== kind) return false;
  if (value_lower === undefined) return true;
  return t.value.toLowerCase() === value_lower;
}

function ts_peek(ts: token_stream_t, offset = 0): token_t {
  const idx = ts.i + offset;
  if (idx >= ts.tokens.length)
    return { kind: 'eof', value: '', pos: ts.tokens.length };
  return ts.tokens[idx];
}

function ts_next(ts: token_stream_t): token_t {
  const t = ts_peek(ts, 0);
  ts.i = Math.min(ts.i + 1, ts.tokens.length);
  return t;
}

function ts_expect(
  ts: token_stream_t,
  kind: token_kind_t,
  value_lower?: string
): token_t | null {
  const t = ts_peek(ts);
  if (!token_is(t, kind, value_lower)) return null;
  ts_next(ts);
  return t;
}

function ts_expect_keyword(ts: token_stream_t, kw: string): token_t | null {
  const t = ts_peek(ts);
  if (t.kind !== 'keyword') return null;
  if (t.value.toLowerCase() !== kw.toLowerCase()) return null;
  ts_next(ts);
  return t;
}

function ts_skip_optional_keyword(ts: token_stream_t, kw: string): boolean {
  const t = ts_peek(ts);
  if (t.kind === 'keyword' && t.value.toLowerCase() === kw.toLowerCase()) {
    ts_next(ts);
    return true;
  }
  return false;
}

function make_error(
  code: validation_error_t['code'],
  message: string,
  pos?: number
): validation_error_t {
  return { code, message, position: pos };
}

function make_warning(
  code: validation_warning_t['code'],
  message: string,
  pos?: number
): validation_warning_t {
  return { code, message, position: pos };
}

/* ------------------------------ tokenizer logic ------------------------------ */

export class SQLTokenizer {
  public tokenize(sql: string): token_t[] {
    const tokens: token_t[] = [];
    let i = 0;
    let token_pos = 0;

    const push = (kind: token_kind_t, value: string) => {
      tokens.push({ kind, value, pos: token_pos++ });
    };

    const is_ws = (c: string) =>
      c === ' ' || c === '\t' || c === '\r' || c === '\n';
    const is_digit = (c: string) => c >= '0' && c <= '9';
    const is_ident_start = (c: string) =>
      (c >= 'a' && c <= 'z') ||
      (c >= 'A' && c <= 'Z') ||
      c === '_' ||
      c === '$';
    const is_ident_part = (c: string) => is_ident_start(c) || is_digit(c);

    while (i < sql.length) {
      const c = sql[i];

      if (is_ws(c)) {
        i++;
        continue;
      }

      if (c === '-' && sql[i + 1] === '-') {
        i += 2;
        while (i < sql.length && sql[i] !== '\n') i++;
        continue;
      }

      if (c === '/' && sql[i + 1] === '*') {
        i += 2;
        while (i < sql.length) {
          if (sql[i] === '*' && sql[i + 1] === '/') {
            i += 2;
            break;
          }
          i++;
        }
        continue;
      }

      if (c === "'") {
        let s = "'";
        i++;
        while (i < sql.length) {
          const cc = sql[i];
          s += cc;
          i++;
          if (cc === "'" && sql[i - 2] !== '\\') {
            if (sql[i] === "'") {
              s += "'";
              i++;
              continue;
            }
            break;
          }
        }
        push('string', s);
        continue;
      }

      if (c === '`') {
        let s = '';
        i++;
        while (i < sql.length) {
          const cc = sql[i];
          i++;
          if (cc === '`') break;
          s += cc;
        }
        push('ident', s);
        continue;
      }

      if (is_digit(c)) {
        let s = c;
        i++;
        while (i < sql.length && (is_digit(sql[i]) || sql[i] === '.')) {
          s += sql[i];
          i++;
        }
        push('number', s);
        continue;
      }

      if (is_ident_start(c)) {
        let s = c;
        i++;
        while (i < sql.length && is_ident_part(sql[i])) {
          s += sql[i];
          i++;
        }
        if (is_keyword(s)) push('keyword', s.toLowerCase());
        else push('ident', s);
        continue;
      }

      const two = sql.slice(i, i + 2);
      const three = sql.slice(i, i + 3);

      if (three === '<=>') {
        push('operator', three);
        i += 3;
        continue;
      }

      if (
        two === '>=' ||
        two === '<=' ||
        two === '<>' ||
        two === '!=' ||
        two === '||' ||
        two === '&&'
      ) {
        push('operator', two);
        i += 2;
        continue;
      }

      if ('=<>+-*/%!'.includes(c)) {
        push('operator', c);
        i++;
        continue;
      }

      if ('(),.;'.includes(c)) {
        push('punct', c);
        i++;
        continue;
      }

      if (c === '.') {
        push('punct', '.');
        i++;
        continue;
      }

      push('punct', c);
      i++;
    }

    push('eof', '');
    return tokens;
  }
}

/* ------------------------------- parser / ast ------------------------------- */

export class SQLDMLParser {
  private readonly tokenizer = new SQLTokenizer();

  public parse(sql: string): {
    ast: parsed_query_ast_t | null;
    errors: validation_error_t[];
    warnings: validation_warning_t[];
  } {
    const errors: validation_error_t[] = [];
    const warnings: validation_warning_t[] = [];

    const tokens = this.tokenizer.tokenize(sql);
    const ts: token_stream_t = { tokens, i: 0 };

    const first = ts_peek(ts);
    if (first.kind !== 'keyword') {
      errors.push(
        make_error(
          'parse_error',
          'query does not start with a recognized keyword',
          first.pos
        )
      );
      return { ast: null, errors, warnings };
    }

    const kw = first.value.toLowerCase();

    if (kw === 'select') {
      const ast = this.parse_select(ts, errors, warnings);
      return { ast, errors, warnings };
    }
    if (kw === 'insert') {
      const ast = this.parse_insert(ts, errors, warnings);
      return { ast, errors, warnings };
    }
    if (kw === 'update') {
      const ast = this.parse_update(ts, errors, warnings);
      return { ast, errors, warnings };
    }
    if (kw === 'delete') {
      const ast = this.parse_delete(ts, errors, warnings);
      return { ast, errors, warnings };
    }

    errors.push(
      make_error(
        'unsupported_query',
        `unsupported query kind: ${kw}`,
        first.pos
      )
    );
    return { ast: null, errors, warnings };
  }

  private parse_select(
    ts: token_stream_t,
    errors: validation_error_t[],
    warnings: validation_warning_t[]
  ): select_ast_t | null {
    ts_expect_keyword(ts, 'select');

    const early = ts_peek(ts);
    if (early.kind === 'keyword' && early.value === 'with') {
      errors.push(
        make_error(
          'unsupported_query',
          'CTE/WITH is not supported by this validator version',
          early.pos
        )
      );
      return null;
    }

    if (
      ts_peek(ts).kind === 'keyword' &&
      (ts_peek(ts).value === 'distinct' || ts_peek(ts).value === 'all')
    ) {
      ts_next(ts);
    }

    const select_list_span = this.consume_until_keyword(ts, 'from');
    if (!select_list_span) {
      errors.push(
        make_error(
          'parse_error',
          'SELECT missing FROM clause (validator requires FROM)',
          ts_peek(ts).pos
        )
      );
      return null;
    }

    const select_expr_spans = this.split_top_level_commas(
      ts.tokens,
      select_list_span
    );

    const from_kw = ts_expect_keyword(ts, 'from');
    if (!from_kw) {
      errors.push(
        make_error(
          'parse_error',
          'SELECT missing FROM keyword',
          ts_peek(ts).pos
        )
      );
      return null;
    }

    const from_sources = this.parse_from_clause(ts, errors, warnings);
    if (!from_sources || from_sources.length === 0) {
      errors.push(
        make_error(
          'missing_table',
          'SELECT FROM has no base table',
          ts_peek(ts).pos
        )
      );
      return null;
    }

    let where_span: expr_span_t | null = null;
    let group_by_spans: expr_span_t[] | null = null;
    let having_span: expr_span_t | null = null;
    let order_by_spans: expr_span_t[] | null = null;
    let limit_span: expr_span_t | null = null;

    if (ts_expect_keyword(ts, 'where')) {
      where_span = this.consume_expression_until_any_clause(ts, [
        'group',
        'having',
        'order',
        'limit',
        'union',
        'returning'
      ]);
    }

    if (ts_peek(ts).kind === 'keyword' && ts_peek(ts).value === 'group') {
      ts_next(ts);
      if (!ts_expect_keyword(ts, 'by')) {
        errors.push(
          make_error('parse_error', 'expected BY after GROUP', ts_peek(ts).pos)
        );
        return null;
      }
      const gb_span = this.consume_expression_until_any_clause(ts, [
        'having',
        'order',
        'limit',
        'union',
        'returning'
      ]);
      group_by_spans = this.split_top_level_commas(ts.tokens, gb_span);
    }

    if (ts_expect_keyword(ts, 'having')) {
      having_span = this.consume_expression_until_any_clause(ts, [
        'order',
        'limit',
        'union',
        'returning'
      ]);
    }

    if (ts_peek(ts).kind === 'keyword' && ts_peek(ts).value === 'order') {
      ts_next(ts);
      if (!ts_expect_keyword(ts, 'by')) {
        errors.push(
          make_error('parse_error', 'expected BY after ORDER', ts_peek(ts).pos)
        );
        return null;
      }
      const ob_span = this.consume_expression_until_any_clause(ts, [
        'limit',
        'union',
        'returning'
      ]);
      order_by_spans = this.split_top_level_commas(ts.tokens, ob_span);
    }

    if (ts_expect_keyword(ts, 'limit')) {
      limit_span = this.consume_expression_until_any_clause(ts, [
        'union',
        'returning'
      ]);
    }

    if (ts_peek(ts).kind === 'keyword' && ts_peek(ts).value === 'union') {
      errors.push(
        make_error(
          'unsupported_query',
          'UNION is not supported by this validator version',
          ts_peek(ts).pos
        )
      );
      return null;
    }

    const select_column_refs: column_ref_t[] = [];
    const select_star_refs: star_ref_t[] = [];

    for (const sp of select_expr_spans) {
      const { cols, stars } = this.extract_select_refs(ts.tokens, sp);
      for (const c of cols) select_column_refs.push(c);
      for (const s of stars) select_star_refs.push(s);
    }

    const join_on_column_refs: column_ref_t[] = [];
    for (const src of from_sources) {
      for (const j of src.joins) {
        if (j.on_span) {
          const refs = this.extract_column_refs(ts.tokens, j.on_span);
          for (const r of refs) join_on_column_refs.push(r);
        }
      }
    }

    const where_column_refs = where_span
      ? this.extract_column_refs(ts.tokens, where_span)
      : [];

    const group_by_column_refs: column_ref_t[] = [];
    if (group_by_spans) {
      for (const sp of group_by_spans) {
        const refs = this.extract_column_refs(ts.tokens, sp);
        for (const r of refs) group_by_column_refs.push(r);
      }
    }

    const having_column_refs = having_span
      ? this.extract_column_refs(ts.tokens, having_span)
      : [];

    const order_by_column_refs: column_ref_t[] = [];
    if (order_by_spans) {
      for (const sp of order_by_spans) {
        const refs = this.extract_column_refs(ts.tokens, sp);
        for (const r of refs) order_by_column_refs.push(r);
      }
    }

    return {
      kind: 'select',
      select_expr_spans,
      from_sources,
      where_span,
      group_by_spans,
      having_span,
      order_by_spans,
      limit_span,

      select_column_refs,
      select_star_refs,

      where_column_refs,
      join_on_column_refs,
      group_by_column_refs,
      having_column_refs,
      order_by_column_refs
    };
  }

  private parse_from_clause(
    ts: token_stream_t,
    errors: validation_error_t[],
    warnings: validation_warning_t[]
  ): from_source_t[] | null {
    const sources: from_source_t[] = [];

    const first = this.parse_qualified_table_name(ts, errors, warnings);
    if (!first) return null;

    const base: from_source_t = { table: first, joins: [] };
    sources.push(base);

    while (true) {
      const join_type = this.parse_join_type(ts);
      if (!join_type) break;

      if (ts_peek(ts).kind === 'keyword' && ts_peek(ts).value === 'using') {
        errors.push(
          make_error(
            'unsupported_query',
            'JOIN ... USING is not supported by this validator version',
            ts_peek(ts).pos
          )
        );
        return null;
      }

      const join_table = this.parse_qualified_table_name(ts, errors, warnings);
      if (!join_table) {
        errors.push(
          make_error(
            'parse_error',
            'expected table name after JOIN',
            ts_peek(ts).pos
          )
        );
        return null;
      }

      let on_span: expr_span_t | null = null;
      if (ts_expect_keyword(ts, 'on')) {
        on_span = this.consume_expression_until_any_clause(ts, [
          'join',
          'left',
          'right',
          'inner',
          'outer',
          'cross',
          'where',
          'group',
          'having',
          'order',
          'limit',
          'union',
          'returning'
        ]);
      } else {
        if (join_type !== 'cross join') {
          errors.push(
            make_error(
              'parse_error',
              'JOIN missing ON clause (only CROSS JOIN may omit ON in this validator version)',
              ts_peek(ts).pos
            )
          );
          return null;
        }
      }

      base.joins.push({ join_type, table: join_table, on_span });
    }

    if (ts_peek(ts).kind === 'punct' && ts_peek(ts).value === ',') {
      errors.push(
        make_error(
          'unsupported_query',
          'comma-join FROM t1, t2 is not supported by this validator version',
          ts_peek(ts).pos
        )
      );
      return null;
    }

    if (ts_peek(ts).kind === 'punct' && ts_peek(ts).value === '(') {
      errors.push(
        make_error(
          'unsupported_query',
          'derived tables/subqueries in FROM are not supported by this validator version',
          ts_peek(ts).pos
        )
      );
      return null;
    }

    return sources;
  }

  private parse_join_type(
    ts: token_stream_t
  ): join_clause_t['join_type'] | null {
    const t0 = ts_peek(ts);
    if (t0.kind !== 'keyword') return null;

    const v0 = t0.value;

    if (v0 === 'join') {
      ts_next(ts);
      return 'join';
    }

    if (
      v0 === 'left' ||
      v0 === 'right' ||
      v0 === 'inner' ||
      v0 === 'outer' ||
      v0 === 'cross'
    ) {
      ts_next(ts);
      ts_expect_keyword(ts, 'join');
      return (v0 + ' join') as join_clause_t['join_type'];
    }

    return null;
  }

  private parse_insert(
    ts: token_stream_t,
    errors: validation_error_t[],
    warnings: validation_warning_t[]
  ): insert_ast_t | null {
    ts_expect_keyword(ts, 'insert');
    ts_skip_optional_keyword(ts, 'into');

    const target = this.parse_qualified_table_name(ts, errors, warnings);
    if (!target) {
      errors.push(
        make_error(
          'missing_table',
          'INSERT missing target table',
          ts_peek(ts).pos
        )
      );
      return null;
    }

    const next_kw = ts_peek(ts);
    if (next_kw.kind === 'keyword' && next_kw.value === 'select') {
      errors.push(
        make_error(
          'unsupported_query',
          'INSERT ... SELECT is not supported by this validator version',
          next_kw.pos
        )
      );
      return null;
    }

    let columns: string[] | null = null;
    if (ts_expect(ts, 'punct', '(')) {
      columns = this.parse_ident_list_until_rparen(ts, errors);
      if (!columns) return null;
    }

    const mode_tok = ts_peek(ts);

    if (
      mode_tok.kind === 'keyword' &&
      (mode_tok.value === 'values' || mode_tok.value === 'value')
    ) {
      ts_next(ts);
      const values_rows = this.parse_values_rows(ts, errors);
      if (!values_rows) {
        errors.push(
          make_error(
            'missing_values_clause',
            'INSERT VALUES clause is missing or invalid',
            mode_tok.pos
          )
        );
        return null;
      }
      if (!columns) {
        warnings.push(
          make_warning(
            'no_column_list',
            'INSERT has no explicit column list; only row arity can be checked.',
            mode_tok.pos
          )
        );
      }
      return {
        kind: 'insert',
        target,
        mode: 'values',
        columns,
        values_rows,
        set_pairs: null
      };
    }

    if (mode_tok.kind === 'keyword' && mode_tok.value === 'set') {
      ts_next(ts);
      const set_pairs = this.parse_set_pairs(ts, errors);
      if (!set_pairs || set_pairs.length === 0) {
        errors.push(
          make_error(
            'missing_set_clause',
            'INSERT SET clause is missing or invalid',
            mode_tok.pos
          )
        );
        return null;
      }
      if (columns) {
        warnings.push(
          make_warning(
            'partial_support',
            'INSERT has both column list and SET form; validator will prioritize SET pairs.',
            mode_tok.pos
          )
        );
      }
      return {
        kind: 'insert',
        target,
        mode: 'set',
        columns: null,
        values_rows: null,
        set_pairs
      };
    }

    errors.push(
      make_error(
        'invalid_syntax',
        'INSERT must use VALUES (...) or SET col=expr form (INSERT ... SELECT not supported).',
        mode_tok.pos
      )
    );
    return null;
  }

  private parse_update(
    ts: token_stream_t,
    errors: validation_error_t[],
    warnings: validation_warning_t[]
  ): update_ast_t | null {
    ts_expect_keyword(ts, 'update');

    const target = this.parse_qualified_table_name(ts, errors, warnings);
    if (!target) {
      errors.push(
        make_error(
          'missing_table',
          'UPDATE missing target table',
          ts_peek(ts).pos
        )
      );
      return null;
    }

    const maybe_join = ts_peek(ts);
    if (
      maybe_join.kind === 'keyword' &&
      (maybe_join.value === 'join' ||
        maybe_join.value === 'left' ||
        maybe_join.value === 'right' ||
        maybe_join.value === 'inner' ||
        maybe_join.value === 'outer' ||
        maybe_join.value === 'cross')
    ) {
      errors.push(
        make_error(
          'unsupported_query',
          'UPDATE with JOIN is not supported by this validator version (single-table UPDATE only).',
          maybe_join.pos
        )
      );
      return null;
    }

    const set_kw = ts_expect_keyword(ts, 'set');
    if (!set_kw) {
      errors.push(
        make_error(
          'missing_set_clause',
          'UPDATE missing SET clause',
          ts_peek(ts).pos
        )
      );
      return null;
    }

    const set_pairs = this.parse_set_pairs(ts, errors);
    if (!set_pairs || set_pairs.length === 0) {
      errors.push(
        make_error(
          'missing_set_clause',
          'UPDATE SET clause is empty or invalid',
          set_kw.pos
        )
      );
      return null;
    }

    let where_span: expr_span_t | null = null;
    let where_column_refs: column_ref_t[] = [];

    if (ts_expect_keyword(ts, 'where')) {
      where_span = this.consume_expression_until_any_clause(ts, [
        'order',
        'limit',
        'returning'
      ]);
      where_column_refs = this.extract_column_refs(ts.tokens, where_span);
    } else {
      warnings.push(
        make_warning(
          'where_not_present',
          'UPDATE has no WHERE clause (this is allowed but risky).',
          ts_peek(ts).pos
        )
      );
    }

    return { kind: 'update', target, set_pairs, where_span, where_column_refs };
  }

  private parse_delete(
    ts: token_stream_t,
    errors: validation_error_t[],
    warnings: validation_warning_t[]
  ): delete_ast_t | null {
    ts_expect_keyword(ts, 'delete');

    const from_kw = ts_expect_keyword(ts, 'from');
    if (!from_kw) {
      errors.push(
        make_error(
          'unsupported_query',
          'Only DELETE FROM <table> ... is supported (single-table delete).',
          ts_peek(ts).pos
        )
      );
      return null;
    }

    const target = this.parse_qualified_table_name(ts, errors, warnings);
    if (!target) {
      errors.push(
        make_error(
          'missing_table',
          'DELETE missing target table',
          ts_peek(ts).pos
        )
      );
      return null;
    }

    let where_span: expr_span_t | null = null;
    let where_column_refs: column_ref_t[] = [];

    if (ts_expect_keyword(ts, 'where')) {
      where_span = this.consume_expression_until_any_clause(ts, [
        'order',
        'limit',
        'returning'
      ]);
      where_column_refs = this.extract_column_refs(ts.tokens, where_span);
    } else {
      warnings.push(
        make_warning(
          'where_not_present',
          'DELETE has no WHERE clause (this is allowed but risky).',
          ts_peek(ts).pos
        )
      );
    }

    return { kind: 'delete', target, where_span, where_column_refs };
  }

  private parse_qualified_table_name(
    ts: token_stream_t,
    errors: validation_error_t[],
    warnings: validation_warning_t[]
  ): qualified_table_name_t | null {
    const first = ts_peek(ts);
    if (!is_name_token(first)) return null;

    const part1 = normalize_ident(ts_next(ts).value);
    let db: string | null = null;
    let table = part1;

    if (ts_expect(ts, 'punct', '.')) {
      db = part1;
      const t2 = ts_peek(ts);
      if (!is_name_token(t2)) {
        errors.push(
          make_error('parse_error', 'expected table name after db.', t2.pos)
        );
        return null;
      }
      table = normalize_ident(ts_next(ts).value);
      warnings.push(
        make_warning(
          'ignored_qualified_db',
          'qualified db.table found; validator ignores db qualifier and uses snapshot database context.',
          first.pos
        )
      );
    }

    let alias: string | null = null;

    if (ts_peek(ts).kind === 'keyword' && ts_peek(ts).value === 'as') {
      ts_next(ts);
      const a1 = ts_peek(ts);
      if (!is_name_token(a1)) {
        errors.push(
          make_error('parse_error', 'expected alias after AS', a1.pos)
        );
        return null;
      }
      alias = normalize_ident(ts_next(ts).value);
    } else {
      const a1 = ts_peek(ts);
      if (a1.kind === 'ident') {
        alias = normalize_ident(ts_next(ts).value);
      }
    }

    return { db, table, alias };
  }

  private parse_ident_list_until_rparen(
    ts: token_stream_t,
    errors: validation_error_t[]
  ): string[] | null {
    const cols: string[] = [];
    while (true) {
      const t = ts_peek(ts);
      if (t.kind === 'punct' && t.value === ')') {
        ts_next(ts);
        break;
      }

      if (!is_name_token(t)) {
        errors.push(
          make_error('parse_error', 'expected identifier in column list', t.pos)
        );
        return null;
      }

      cols.push(normalize_ident(ts_next(ts).value));

      const sep = ts_peek(ts);
      if (sep.kind === 'punct' && sep.value === ',') {
        ts_next(ts);
        continue;
      }
      if (sep.kind === 'punct' && sep.value === ')') {
        ts_next(ts);
        break;
      }

      errors.push(
        make_error('parse_error', "expected ',' or ')' in column list", sep.pos)
      );
      return null;
    }
    return cols;
  }

  private parse_values_rows(
    ts: token_stream_t,
    errors: validation_error_t[]
  ): expr_span_t[][] | null {
    const rows: expr_span_t[][] = [];

    while (true) {
      const lp = ts_expect(ts, 'punct', '(');
      if (!lp) {
        errors.push(
          make_error(
            'parse_error',
            "expected '(' to start VALUES row",
            ts_peek(ts).pos
          )
        );
        return null;
      }

      const row_exprs = this.parse_expr_list_until_rparen(ts, errors);
      if (!row_exprs) return null;
      rows.push(row_exprs);

      const next = ts_peek(ts);
      if (next.kind === 'punct' && next.value === ',') {
        ts_next(ts);
        continue;
      }

      if (
        (next.kind === 'punct' && next.value === ';') ||
        next.kind === 'eof'
      ) {
        if (next.kind === 'punct') ts_next(ts);
        break;
      }

      if (next.kind === 'keyword') break;
      break;
    }

    return rows;
  }

  private parse_expr_list_until_rparen(
    ts: token_stream_t,
    errors: validation_error_t[]
  ): expr_span_t[] | null {
    const exprs: expr_span_t[] = [];
    let nesting = 0;

    let current_start = ts_peek(ts).pos;

    while (true) {
      const t = ts_peek(ts);

      if (t.kind === 'eof') {
        errors.push(
          make_error(
            'parse_error',
            'unexpected end of input while parsing expression list',
            t.pos
          )
        );
        return null;
      }

      if (t.kind === 'punct') {
        if (t.value === '(') {
          nesting++;
          ts_next(ts);
          continue;
        }
        if (t.value === ')') {
          if (nesting === 0) {
            const end_pos = t.pos;
            if (end_pos > current_start) {
              exprs.push({ start_pos: current_start, end_pos });
            } else {
              errors.push(
                make_error(
                  'parse_error',
                  'empty expression in VALUES list',
                  t.pos
                )
              );
              return null;
            }
            ts_next(ts);
            break;
          } else {
            nesting--;
            ts_next(ts);
            continue;
          }
        }
        if (t.value === ',' && nesting === 0) {
          const end_pos = t.pos;
          if (end_pos <= current_start) {
            errors.push(
              make_error(
                'parse_error',
                'empty expression in VALUES list',
                t.pos
              )
            );
            return null;
          }
          exprs.push({ start_pos: current_start, end_pos });
          ts_next(ts);
          current_start = ts_peek(ts).pos;
          continue;
        }
      }

      ts_next(ts);
    }

    return exprs;
  }

  private parse_set_pairs(
    ts: token_stream_t,
    errors: validation_error_t[]
  ): { column: column_ref_t; value: expr_span_t }[] | null {
    const pairs: { column: column_ref_t; value: expr_span_t }[] = [];

    while (true) {
      const col = this.parse_column_ref(ts, errors);
      if (!col) return pairs.length ? pairs : null;

      const eq = ts_expect(ts, 'operator', '=');
      if (!eq) {
        errors.push(
          make_error(
            'parse_error',
            "expected '=' in SET assignment",
            ts_peek(ts).pos
          )
        );
        return null;
      }

      const value_span = this.consume_expression_until_any_clause_or_comma(ts, [
        'where',
        'order',
        'limit',
        'returning'
      ]);
      if (value_span.end_pos <= value_span.start_pos) {
        errors.push(
          make_error('parse_error', "expected expression after '='", eq.pos)
        );
        return null;
      }

      pairs.push({ column: col, value: value_span });

      const next = ts_peek(ts);

      if (next.kind === 'punct' && next.value === ',') {
        ts_next(ts);
        continue;
      }

      if (
        next.kind === 'keyword' ||
        next.kind === 'eof' ||
        (next.kind === 'punct' && next.value === ';')
      ) {
        if (next.kind === 'punct' && next.value === ';') ts_next(ts);
        break;
      }

      break;
    }

    return pairs;
  }

  private parse_column_ref(
    ts: token_stream_t,
    errors: validation_error_t[]
  ): column_ref_t | null {
    const t1 = ts_peek(ts);
    if (!is_name_token(t1)) {
      errors.push(
        make_error('parse_error', 'expected column identifier', t1.pos)
      );
      return null;
    }

    const v1 = normalize_ident(ts_next(ts).value);
    const dot = ts_peek(ts);

    if (dot.kind === 'punct' && dot.value === '.') {
      ts_next(ts);
      const t2 = ts_peek(ts);
      if (!is_name_token(t2)) {
        errors.push(
          make_error(
            'parse_error',
            "expected identifier after '.' in column reference",
            t2.pos
          )
        );
        return null;
      }
      const v2 = normalize_ident(ts_next(ts).value);
      return { qualifier: v1, name: v2, pos: t1.pos };
    }

    return { qualifier: null, name: v1, pos: t1.pos };
  }

  private consume_until_keyword(
    ts: token_stream_t,
    kw: string
  ): expr_span_t | null {
    const start_pos = ts_peek(ts).pos;
    let nesting = 0;

    while (true) {
      const t = ts_peek(ts);
      if (t.kind === 'eof') return null;

      if (t.kind === 'punct') {
        if (t.value === '(') nesting++;
        else if (t.value === ')') nesting = Math.max(0, nesting - 1);
      }

      if (nesting === 0 && t.kind === 'keyword' && t.value === kw) {
        const end_pos = t.pos;
        return { start_pos, end_pos };
      }

      ts_next(ts);
    }
  }

  private consume_expression_until_any_clause(
    ts: token_stream_t,
    clause_keywords: string[]
  ): expr_span_t {
    const start_pos = ts_peek(ts).pos;
    let nesting = 0;

    while (true) {
      const t = ts_peek(ts);
      if (t.kind === 'eof') break;

      if (t.kind === 'punct') {
        if (t.value === '(') nesting++;
        else if (t.value === ')') nesting = Math.max(0, nesting - 1);
        else if (t.value === ';') break;
      }

      if (nesting === 0 && t.kind === 'keyword') {
        const v = t.value.toLowerCase();
        if (clause_keywords.includes(v)) break;
        if (v === 'group' || v === 'order') break;
      }

      ts_next(ts);
    }

    const end_pos = ts_peek(ts).pos;
    return { start_pos, end_pos };
  }

  private consume_expression_until_any_clause_or_comma(
    ts: token_stream_t,
    clause_keywords: string[]
  ): expr_span_t {
    const start_pos = ts_peek(ts).pos;
    let nesting = 0;

    while (true) {
      const t = ts_peek(ts);
      if (t.kind === 'eof') break;

      if (t.kind === 'punct') {
        if (t.value === '(') nesting++;
        else if (t.value === ')') nesting = Math.max(0, nesting - 1);
        else if (t.value === ',' && nesting === 0) break;
        else if (t.value === ';') break;
      }

      if (nesting === 0 && t.kind === 'keyword') {
        const v = t.value.toLowerCase();
        if (clause_keywords.includes(v)) break;
      }

      ts_next(ts);
    }

    const end_pos = ts_peek(ts).pos;
    return { start_pos, end_pos };
  }

  private split_top_level_commas(
    tokens: token_t[],
    span: expr_span_t
  ): expr_span_t[] {
    const spans: expr_span_t[] = [];
    let nesting = 0;
    let current_start = span.start_pos;

    for (let i = span.start_pos; i < span.end_pos; i++) {
      const t = tokens[i];

      if (t.kind === 'punct') {
        if (t.value === '(') nesting++;
        else if (t.value === ')') nesting = Math.max(0, nesting - 1);
        else if (t.value === ',' && nesting === 0) {
          spans.push(
            this.trim_span(tokens, { start_pos: current_start, end_pos: t.pos })
          );
          current_start = t.pos + 1;
        }
      }
    }

    spans.push(
      this.trim_span(tokens, {
        start_pos: current_start,
        end_pos: span.end_pos
      })
    );

    return spans.filter((s) => s.end_pos > s.start_pos);
  }

  private trim_span(tokens: token_t[], span: expr_span_t): expr_span_t {
    let a = span.start_pos;
    let b = span.end_pos;

    while (
      a < b &&
      tokens[a] &&
      tokens[a].kind === 'punct' &&
      (tokens[a].value === ',' || tokens[a].value === ';')
    )
      a++;
    while (
      b > a &&
      tokens[b - 1] &&
      tokens[b - 1].kind === 'punct' &&
      (tokens[b - 1].value === ',' || tokens[b - 1].value === ';')
    )
      b--;

    return { start_pos: a, end_pos: b };
  }

  private extract_column_refs(
    tokens: token_t[],
    span: expr_span_t
  ): column_ref_t[] {
    const refs: column_ref_t[] = [];
    const start = Math.max(0, span.start_pos);
    const end = Math.min(tokens.length, span.end_pos);

    for (let i = start; i < end; i++) {
      const t = tokens[i];
      if (t.kind !== 'ident' && t.kind !== 'keyword') continue;
      if (t.kind === 'keyword' && is_keyword(t.value)) continue;

      const v = normalize_ident(t.value);
      const next = tokens[i + 1];
      const next2 = tokens[i + 2];

      if (next && next.kind === 'punct' && next.value === '(') continue;

      if (
        next &&
        next.kind === 'punct' &&
        next.value === '.' &&
        next2 &&
        (next2.kind === 'ident' || next2.kind === 'keyword')
      ) {
        if (next2.kind === 'keyword' && is_keyword(next2.value)) continue;
        refs.push({
          qualifier: v,
          name: normalize_ident(next2.value),
          pos: t.pos
        });
        i += 2;
        continue;
      }

      refs.push({ qualifier: null, name: v, pos: t.pos });
    }

    return refs;
  }

  private extract_select_refs(
    tokens: token_t[],
    span: expr_span_t
  ): { cols: column_ref_t[]; stars: star_ref_t[] } {
    const cols = this.extract_column_refs(tokens, span);
    const stars: star_ref_t[] = [];

    const start = Math.max(0, span.start_pos);
    const end = Math.min(tokens.length, span.end_pos);

    for (let i = start; i < end; i++) {
      const t = tokens[i];

      if (t.kind === 'operator' && t.value === '*') {
        stars.push({ kind: 'star', qualifier: null, pos: t.pos });
        continue;
      }

      if (
        (t.kind === 'ident' || t.kind === 'keyword') &&
        !(t.kind === 'keyword' && is_keyword(t.value))
      ) {
        const next = tokens[i + 1];
        const next2 = tokens[i + 2];
        if (
          next &&
          next.kind === 'punct' &&
          next.value === '.' &&
          next2 &&
          next2.kind === 'operator' &&
          next2.value === '*'
        ) {
          stars.push({
            kind: 'star',
            qualifier: normalize_ident(t.value),
            pos: t.pos
          });
          i += 2;
          continue;
        }
      }
    }

    return { cols, stars };
  }
}

/* ------------------------------ schema validator ------------------------------ */

export class MariaDBSQLQueryValidator {
  private readonly snapshot: schema_snapshot_t;
  private readonly parser = new SQLDMLParser();
  private readonly opts: Required<validator_options_t>;

  constructor(schema_snapshot: schema_snapshot_t, opts?: validator_options_t) {
    this.snapshot = schema_snapshot;
    this.opts = {
      strict_expression_identifiers: opts?.strict_expression_identifiers ?? true
    };
  }

  public validate(sql: string): validation_result_t {
    const { ast, errors, warnings } = this.parser.parse(sql);

    if (!ast) {
      return { ok: false, kind: 'unknown', errors, warnings };
    }

    if (ast.kind === 'select') {
      this.validate_select_ast(ast, errors, warnings);
      return { ok: errors.length === 0, kind: 'select', errors, warnings };
    }

    if (ast.kind === 'insert') {
      this.validate_insert_ast(ast, errors, warnings);
      return { ok: errors.length === 0, kind: 'insert', errors, warnings };
    }

    if (ast.kind === 'update') {
      this.validate_update_ast(ast, errors, warnings);
      return { ok: errors.length === 0, kind: 'update', errors, warnings };
    }

    if (ast.kind === 'delete') {
      this.validate_delete_ast(ast, errors, warnings);
      return { ok: errors.length === 0, kind: 'delete', errors, warnings };
    }

    return {
      ok: false,
      kind: 'unknown',
      errors: errors.concat(
        make_error('unsupported_query', 'unknown AST kind')
      ),
      warnings
    };
  }

  private validate_select_ast(
    ast: select_ast_t,
    errors: validation_error_t[],
    warnings: validation_warning_t[]
  ): void {
    const env = this.build_from_environment(ast, errors);
    if (!env) return;

    for (const s of ast.select_star_refs) {
      if (s.qualifier) {
        if (!env.alias_to_table.has(s.qualifier)) {
          errors.push(
            make_error(
              'invalid_qualifier',
              `unknown qualifier for * expansion: ${s.qualifier}.*`,
              s.pos
            )
          );
        }
      }
    }

    for (const ref of ast.select_column_refs) {
      this.validate_column_ref_in_env(
        ref,
        env,
        errors,
        warnings,
        false,
        'SELECT'
      );
    }

    for (const ref of ast.join_on_column_refs) {
      this.validate_column_ref_in_env(
        ref,
        env,
        errors,
        warnings,
        true,
        'JOIN ON'
      );
    }

    for (const ref of ast.where_column_refs) {
      this.validate_column_ref_in_env(
        ref,
        env,
        errors,
        warnings,
        true,
        'WHERE'
      );
    }

    for (const ref of ast.group_by_column_refs) {
      this.validate_column_ref_in_env(
        ref,
        env,
        errors,
        warnings,
        true,
        'GROUP BY'
      );
    }

    for (const ref of ast.having_column_refs) {
      this.validate_column_ref_in_env(
        ref,
        env,
        errors,
        warnings,
        true,
        'HAVING'
      );
    }

    for (const ref of ast.order_by_column_refs) {
      this.validate_column_ref_in_env(
        ref,
        env,
        errors,
        warnings,
        true,
        'ORDER BY'
      );
    }

    warnings.push(
      make_warning(
        'unvalidated_expression',
        'SELECT expressions are not type-checked in this version (validator checks table/alias/column existence and ambiguity).'
      )
    );
  }

  private build_from_environment(
    ast: select_ast_t,
    errors: validation_error_t[]
  ): {
    alias_to_table: Map<string, table_schema_t>;
    all_tables: table_schema_t[];
  } | null {
    const alias_to_table = new Map<string, table_schema_t>();
    const all_tables: table_schema_t[] = [];

    const base = ast.from_sources[0];
    const base_table = this.resolve_table(base.table, errors);
    if (!base_table) return null;

    this.add_table_binding(
      alias_to_table,
      all_tables,
      base.table,
      base_table,
      errors
    );

    for (const j of base.joins) {
      const jt = this.resolve_table(j.table, errors);
      if (!jt) return null;
      this.add_table_binding(alias_to_table, all_tables, j.table, jt, errors);
    }

    return { alias_to_table, all_tables };
  }

  private add_table_binding(
    alias_to_table: Map<string, table_schema_t>,
    all_tables: table_schema_t[],
    name: qualified_table_name_t,
    table: table_schema_t,
    errors: validation_error_t[]
  ): void {
    all_tables.push(table);

    if (!alias_to_table.has(name.table)) {
      alias_to_table.set(name.table, table);
    }

    if (name.alias) {
      if (alias_to_table.has(name.alias)) {
        errors.push(
          make_error(
            'parse_error',
            `duplicate alias in FROM/JOIN: ${name.alias}`
          )
        );
      } else {
        alias_to_table.set(name.alias, table);
      }
    }
  }

  private validate_column_ref_in_env(
    ref: column_ref_t,
    env: {
      alias_to_table: Map<string, table_schema_t>;
      all_tables: table_schema_t[];
    },
    errors: validation_error_t[],
    warnings: validation_warning_t[],
    expression_context: boolean,
    context_label: string
  ): void {
    if (ref.qualifier) {
      const table = env.alias_to_table.get(ref.qualifier) ?? null;
      if (!table) {
        errors.push(
          make_error(
            'invalid_qualifier',
            `unknown qualifier '${ref.qualifier}' in ${context_label}`,
            ref.pos
          )
        );
        return;
      }

      if (!table.columns[ref.name]) {
        this.emit_unknown_identifier(
          errors,
          warnings,
          expression_context,
          `unknown column in ${context_label}: ${table.name}.${ref.name}`,
          ref.pos
        );
      }

      return;
    }

    const matches: string[] = [];
    for (const t of env.all_tables) {
      if (t.columns[ref.name]) matches.push(t.name);
    }

    if (matches.length === 0) {
      this.emit_unknown_identifier(
        errors,
        warnings,
        expression_context,
        `unknown column in ${context_label}: ${ref.name}`,
        ref.pos
      );
      return;
    }

    if (matches.length > 1) {
      errors.push(
        make_error(
          'ambiguous_column',
          `ambiguous column '${ref.name}' in ${context_label}; matches: ${matches.join(', ')}`,
          ref.pos
        )
      );
      return;
    }
  }

  private emit_unknown_identifier(
    errors: validation_error_t[],
    warnings: validation_warning_t[],
    expression_context: boolean,
    message: string,
    pos: number
  ): void {
    if (!expression_context) {
      errors.push(make_error('unknown_column', message, pos));
      return;
    }

    if (this.opts.strict_expression_identifiers) {
      errors.push(make_error('unknown_column', message, pos));
    } else {
      warnings.push(make_warning('partial_support', message, pos));
    }
  }

  private validate_insert_ast(
    ast: insert_ast_t,
    errors: validation_error_t[],
    warnings: validation_warning_t[]
  ): void {
    const table = this.resolve_table(ast.target, errors);
    if (!table) return;

    const allowed_qualifiers = this.allowed_qualifiers_for_target(ast.target);

    if (ast.mode === 'values') {
      if (ast.columns) {
        for (const col of ast.columns) {
          this.assert_column_exists_single_table(
            table,
            allowed_qualifiers,
            { qualifier: null, name: col, pos: 0 },
            errors,
            false
          );
        }
      }

      const rows = ast.values_rows ?? [];
      if (rows.length === 0) {
        errors.push(
          make_error('missing_values_clause', 'INSERT VALUES has no rows')
        );
        return;
      }

      const first_len = rows[0].length;
      for (let i = 1; i < rows.length; i++) {
        if (rows[i].length !== first_len) {
          errors.push(
            make_error(
              'values_count_mismatch',
              `INSERT VALUES row ${i + 1} has ${rows[i].length} expressions; expected ${first_len}`,
              rows[i][0]?.start_pos
            )
          );
        }
      }

      if (ast.columns && ast.columns.length !== first_len) {
        errors.push(
          make_error(
            'values_count_mismatch',
            `INSERT column list has ${ast.columns.length} columns but VALUES rows have ${first_len} expressions`,
            0
          )
        );
      }

      warnings.push(
        make_warning(
          'unvalidated_expression',
          'INSERT VALUES expressions are not type-checked in this version (only structure and column existence).'
        )
      );
      return;
    }

    if (ast.mode === 'set') {
      const set_pairs = ast.set_pairs ?? [];
      if (set_pairs.length === 0) {
        errors.push(
          make_error('missing_set_clause', 'INSERT SET has no assignments')
        );
        return;
      }

      for (const pair of set_pairs) {
        this.assert_column_exists_single_table(
          table,
          allowed_qualifiers,
          pair.column,
          errors,
          false
        );
      }

      warnings.push(
        make_warning(
          'unvalidated_expression',
          'INSERT SET expressions are not type-checked in this version (only column existence).'
        )
      );
      return;
    }

    errors.push(make_error('unsupported_query', 'unsupported INSERT form'));
  }

  private validate_update_ast(
    ast: update_ast_t,
    errors: validation_error_t[],
    warnings: validation_warning_t[]
  ): void {
    const table = this.resolve_table(ast.target, errors);
    if (!table) return;

    const allowed_qualifiers = this.allowed_qualifiers_for_target(ast.target);

    if (!ast.set_pairs || ast.set_pairs.length === 0) {
      errors.push(
        make_error('missing_set_clause', 'UPDATE SET has no assignments')
      );
      return;
    }

    for (const pair of ast.set_pairs) {
      this.assert_column_exists_single_table(
        table,
        allowed_qualifiers,
        pair.column,
        errors,
        false
      );
    }

    for (const ref of ast.where_column_refs) {
      this.assert_column_exists_single_table(
        table,
        allowed_qualifiers,
        ref,
        errors,
        true
      );
    }

    warnings.push(
      make_warning(
        'unvalidated_expression',
        'UPDATE expressions are not type-checked in this version (only column existence).'
      )
    );
  }

  private validate_delete_ast(
    ast: delete_ast_t,
    errors: validation_error_t[],
    warnings: validation_warning_t[]
  ): void {
    const table = this.resolve_table(ast.target, errors);
    if (!table) return;

    const allowed_qualifiers = this.allowed_qualifiers_for_target(ast.target);

    for (const ref of ast.where_column_refs) {
      this.assert_column_exists_single_table(
        table,
        allowed_qualifiers,
        ref,
        errors,
        true
      );
    }

    warnings.push(
      make_warning(
        'unvalidated_expression',
        'DELETE WHERE expressions are not type-checked in this version (only column existence).'
      )
    );
  }

  private resolve_table(
    target: qualified_table_name_t,
    errors: validation_error_t[]
  ): table_schema_t | null {
    const table = this.snapshot.tables[target.table] ?? null;
    if (!table) {
      errors.push(
        make_error(
          'unknown_table',
          `unknown table: ${this.snapshot.database}.${target.table}`
        )
      );
      return null;
    }
    return table;
  }

  private allowed_qualifiers_for_target(
    target: qualified_table_name_t
  ): Set<string> {
    const allowed = new Set<string>();
    allowed.add(target.table);
    if (target.alias) allowed.add(target.alias);
    return allowed;
  }

  private assert_column_exists_single_table(
    table: table_schema_t,
    allowed_qualifiers: Set<string>,
    ref: column_ref_t,
    errors: validation_error_t[],
    expression_context: boolean
  ): void {
    if (ref.qualifier && !allowed_qualifiers.has(ref.qualifier)) {
      errors.push(
        make_error(
          'invalid_qualifier',
          `invalid qualifier '${ref.qualifier}' for column '${ref.name}' in single-table statement`,
          ref.pos
        )
      );
      return;
    }

    if (!table.columns[ref.name]) {
      if (expression_context && !this.opts.strict_expression_identifiers)
        return;
      errors.push(
        make_error(
          'unknown_column',
          `unknown column: ${table.name}.${ref.name}`,
          ref.pos
        )
      );
    }
  }
}
