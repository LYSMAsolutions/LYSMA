
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model AdminUser
 * 
 */
export type AdminUser = $Result.DefaultSelection<Prisma.$AdminUserPayload>
/**
 * Model Client
 * 
 */
export type Client = $Result.DefaultSelection<Prisma.$ClientPayload>
/**
 * Model Acces
 * 
 */
export type Acces = $Result.DefaultSelection<Prisma.$AccesPayload>
/**
 * Model Message
 * 
 */
export type Message = $Result.DefaultSelection<Prisma.$MessagePayload>
/**
 * Model AuditLog
 * 
 */
export type AuditLog = $Result.DefaultSelection<Prisma.$AuditLogPayload>
/**
 * Model ErrorReport
 * 
 */
export type ErrorReport = $Result.DefaultSelection<Prisma.$ErrorReportPayload>
/**
 * Model FinanceSettings
 * 
 */
export type FinanceSettings = $Result.DefaultSelection<Prisma.$FinanceSettingsPayload>
/**
 * Model LysmaExpense
 * 
 */
export type LysmaExpense = $Result.DefaultSelection<Prisma.$LysmaExpensePayload>
/**
 * Model RevenueSubscription
 * 
 */
export type RevenueSubscription = $Result.DefaultSelection<Prisma.$RevenueSubscriptionPayload>
/**
 * Model FinanceInvoice
 * 
 */
export type FinanceInvoice = $Result.DefaultSelection<Prisma.$FinanceInvoicePayload>
/**
 * Model FinancePayment
 * 
 */
export type FinancePayment = $Result.DefaultSelection<Prisma.$FinancePaymentPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const ClientStatut: {
  TRIAL: 'TRIAL',
  ACTIF: 'ACTIF',
  SUSPENDU: 'SUSPENDU',
  RESILIE: 'RESILIE'
};

export type ClientStatut = (typeof ClientStatut)[keyof typeof ClientStatut]


export const MessageStatut: {
  NOUVEAU: 'NOUVEAU',
  LU: 'LU',
  TRAITE: 'TRAITE'
};

export type MessageStatut = (typeof MessageStatut)[keyof typeof MessageStatut]


export const FinanceTool: {
  GLOBAL: 'GLOBAL',
  LIVO: 'LIVO',
  PMA: 'PMA',
  TRANSPORT: 'TRANSPORT',
  AUTRE: 'AUTRE'
};

export type FinanceTool = (typeof FinanceTool)[keyof typeof FinanceTool]


export const FinanceFrequency: {
  MENSUEL: 'MENSUEL',
  ANNUEL: 'ANNUEL',
  PONCTUEL: 'PONCTUEL'
};

export type FinanceFrequency = (typeof FinanceFrequency)[keyof typeof FinanceFrequency]


export const RevenueStatus: {
  ACTIF: 'ACTIF',
  ESSAI: 'ESSAI',
  SUSPENDU: 'SUSPENDU',
  IMPAYE: 'IMPAYE',
  RESILIE: 'RESILIE'
};

export type RevenueStatus = (typeof RevenueStatus)[keyof typeof RevenueStatus]


export const ExpenseCategory: {
  HEBERGEMENT: 'HEBERGEMENT',
  DOMAINE: 'DOMAINE',
  IA: 'IA',
  COMPTABILITE: 'COMPTABILITE',
  PAIEMENT: 'PAIEMENT',
  LOGICIEL: 'LOGICIEL',
  API: 'API',
  MATERIEL: 'MATERIEL',
  AUTRE: 'AUTRE'
};

export type ExpenseCategory = (typeof ExpenseCategory)[keyof typeof ExpenseCategory]


export const ExpenseStatus: {
  ACTIF: 'ACTIF',
  ARRETE: 'ARRETE',
  A_VERIFIER: 'A_VERIFIER'
};

export type ExpenseStatus = (typeof ExpenseStatus)[keyof typeof ExpenseStatus]


export const FinanceVatStatus: {
  FRANCHISE: 'FRANCHISE',
  ASSUJETTI: 'ASSUJETTI'
};

export type FinanceVatStatus = (typeof FinanceVatStatus)[keyof typeof FinanceVatStatus]


export const FinanceDeclarationFrequency: {
  MENSUELLE: 'MENSUELLE',
  TRIMESTRIELLE: 'TRIMESTRIELLE'
};

export type FinanceDeclarationFrequency = (typeof FinanceDeclarationFrequency)[keyof typeof FinanceDeclarationFrequency]


export const FinanceInvoiceStatus: {
  BROUILLON: 'BROUILLON',
  EMISE: 'EMISE',
  PAYEE: 'PAYEE',
  EN_RETARD: 'EN_RETARD',
  ANNULEE: 'ANNULEE'
};

export type FinanceInvoiceStatus = (typeof FinanceInvoiceStatus)[keyof typeof FinanceInvoiceStatus]


export const FinancePaymentStatus: {
  EN_ATTENTE: 'EN_ATTENTE',
  PAYE: 'PAYE',
  ECHOUE: 'ECHOUE',
  REMBOURSE: 'REMBOURSE',
  ANNULE: 'ANNULE'
};

export type FinancePaymentStatus = (typeof FinancePaymentStatus)[keyof typeof FinancePaymentStatus]


export const ElectronicInvoiceStatus: {
  NON_CONCERNE: 'NON_CONCERNE',
  A_PREPARER: 'A_PREPARER',
  EN_ATTENTE: 'EN_ATTENTE',
  TRANSMISE: 'TRANSMISE',
  REJETEE: 'REJETEE',
  ACCEPTEE: 'ACCEPTEE'
};

export type ElectronicInvoiceStatus = (typeof ElectronicInvoiceStatus)[keyof typeof ElectronicInvoiceStatus]

}

export type ClientStatut = $Enums.ClientStatut

export const ClientStatut: typeof $Enums.ClientStatut

export type MessageStatut = $Enums.MessageStatut

export const MessageStatut: typeof $Enums.MessageStatut

export type FinanceTool = $Enums.FinanceTool

export const FinanceTool: typeof $Enums.FinanceTool

export type FinanceFrequency = $Enums.FinanceFrequency

export const FinanceFrequency: typeof $Enums.FinanceFrequency

export type RevenueStatus = $Enums.RevenueStatus

export const RevenueStatus: typeof $Enums.RevenueStatus

export type ExpenseCategory = $Enums.ExpenseCategory

export const ExpenseCategory: typeof $Enums.ExpenseCategory

export type ExpenseStatus = $Enums.ExpenseStatus

export const ExpenseStatus: typeof $Enums.ExpenseStatus

export type FinanceVatStatus = $Enums.FinanceVatStatus

export const FinanceVatStatus: typeof $Enums.FinanceVatStatus

export type FinanceDeclarationFrequency = $Enums.FinanceDeclarationFrequency

export const FinanceDeclarationFrequency: typeof $Enums.FinanceDeclarationFrequency

export type FinanceInvoiceStatus = $Enums.FinanceInvoiceStatus

export const FinanceInvoiceStatus: typeof $Enums.FinanceInvoiceStatus

export type FinancePaymentStatus = $Enums.FinancePaymentStatus

export const FinancePaymentStatus: typeof $Enums.FinancePaymentStatus

export type ElectronicInvoiceStatus = $Enums.ElectronicInvoiceStatus

export const ElectronicInvoiceStatus: typeof $Enums.ElectronicInvoiceStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more AdminUsers
 * const adminUsers = await prisma.adminUser.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more AdminUsers
   * const adminUsers = await prisma.adminUser.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.adminUser`: Exposes CRUD operations for the **AdminUser** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AdminUsers
    * const adminUsers = await prisma.adminUser.findMany()
    * ```
    */
  get adminUser(): Prisma.AdminUserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.client`: Exposes CRUD operations for the **Client** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Clients
    * const clients = await prisma.client.findMany()
    * ```
    */
  get client(): Prisma.ClientDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.acces`: Exposes CRUD operations for the **Acces** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Acces
    * const acces = await prisma.acces.findMany()
    * ```
    */
  get acces(): Prisma.AccesDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.message`: Exposes CRUD operations for the **Message** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Messages
    * const messages = await prisma.message.findMany()
    * ```
    */
  get message(): Prisma.MessageDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.auditLog`: Exposes CRUD operations for the **AuditLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuditLogs
    * const auditLogs = await prisma.auditLog.findMany()
    * ```
    */
  get auditLog(): Prisma.AuditLogDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.errorReport`: Exposes CRUD operations for the **ErrorReport** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ErrorReports
    * const errorReports = await prisma.errorReport.findMany()
    * ```
    */
  get errorReport(): Prisma.ErrorReportDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.financeSettings`: Exposes CRUD operations for the **FinanceSettings** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more FinanceSettings
    * const financeSettings = await prisma.financeSettings.findMany()
    * ```
    */
  get financeSettings(): Prisma.FinanceSettingsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.lysmaExpense`: Exposes CRUD operations for the **LysmaExpense** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LysmaExpenses
    * const lysmaExpenses = await prisma.lysmaExpense.findMany()
    * ```
    */
  get lysmaExpense(): Prisma.LysmaExpenseDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.revenueSubscription`: Exposes CRUD operations for the **RevenueSubscription** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RevenueSubscriptions
    * const revenueSubscriptions = await prisma.revenueSubscription.findMany()
    * ```
    */
  get revenueSubscription(): Prisma.RevenueSubscriptionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.financeInvoice`: Exposes CRUD operations for the **FinanceInvoice** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more FinanceInvoices
    * const financeInvoices = await prisma.financeInvoice.findMany()
    * ```
    */
  get financeInvoice(): Prisma.FinanceInvoiceDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.financePayment`: Exposes CRUD operations for the **FinancePayment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more FinancePayments
    * const financePayments = await prisma.financePayment.findMany()
    * ```
    */
  get financePayment(): Prisma.FinancePaymentDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.3
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    AdminUser: 'AdminUser',
    Client: 'Client',
    Acces: 'Acces',
    Message: 'Message',
    AuditLog: 'AuditLog',
    ErrorReport: 'ErrorReport',
    FinanceSettings: 'FinanceSettings',
    LysmaExpense: 'LysmaExpense',
    RevenueSubscription: 'RevenueSubscription',
    FinanceInvoice: 'FinanceInvoice',
    FinancePayment: 'FinancePayment'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "adminUser" | "client" | "acces" | "message" | "auditLog" | "errorReport" | "financeSettings" | "lysmaExpense" | "revenueSubscription" | "financeInvoice" | "financePayment"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      AdminUser: {
        payload: Prisma.$AdminUserPayload<ExtArgs>
        fields: Prisma.AdminUserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AdminUserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminUserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AdminUserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminUserPayload>
          }
          findFirst: {
            args: Prisma.AdminUserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminUserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AdminUserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminUserPayload>
          }
          findMany: {
            args: Prisma.AdminUserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminUserPayload>[]
          }
          create: {
            args: Prisma.AdminUserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminUserPayload>
          }
          createMany: {
            args: Prisma.AdminUserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AdminUserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminUserPayload>[]
          }
          delete: {
            args: Prisma.AdminUserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminUserPayload>
          }
          update: {
            args: Prisma.AdminUserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminUserPayload>
          }
          deleteMany: {
            args: Prisma.AdminUserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AdminUserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AdminUserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminUserPayload>[]
          }
          upsert: {
            args: Prisma.AdminUserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminUserPayload>
          }
          aggregate: {
            args: Prisma.AdminUserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAdminUser>
          }
          groupBy: {
            args: Prisma.AdminUserGroupByArgs<ExtArgs>
            result: $Utils.Optional<AdminUserGroupByOutputType>[]
          }
          count: {
            args: Prisma.AdminUserCountArgs<ExtArgs>
            result: $Utils.Optional<AdminUserCountAggregateOutputType> | number
          }
        }
      }
      Client: {
        payload: Prisma.$ClientPayload<ExtArgs>
        fields: Prisma.ClientFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ClientFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ClientFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>
          }
          findFirst: {
            args: Prisma.ClientFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ClientFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>
          }
          findMany: {
            args: Prisma.ClientFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>[]
          }
          create: {
            args: Prisma.ClientCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>
          }
          createMany: {
            args: Prisma.ClientCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ClientCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>[]
          }
          delete: {
            args: Prisma.ClientDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>
          }
          update: {
            args: Prisma.ClientUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>
          }
          deleteMany: {
            args: Prisma.ClientDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ClientUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ClientUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>[]
          }
          upsert: {
            args: Prisma.ClientUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>
          }
          aggregate: {
            args: Prisma.ClientAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateClient>
          }
          groupBy: {
            args: Prisma.ClientGroupByArgs<ExtArgs>
            result: $Utils.Optional<ClientGroupByOutputType>[]
          }
          count: {
            args: Prisma.ClientCountArgs<ExtArgs>
            result: $Utils.Optional<ClientCountAggregateOutputType> | number
          }
        }
      }
      Acces: {
        payload: Prisma.$AccesPayload<ExtArgs>
        fields: Prisma.AccesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AccesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AccesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccesPayload>
          }
          findFirst: {
            args: Prisma.AccesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AccesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccesPayload>
          }
          findMany: {
            args: Prisma.AccesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccesPayload>[]
          }
          create: {
            args: Prisma.AccesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccesPayload>
          }
          createMany: {
            args: Prisma.AccesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AccesCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccesPayload>[]
          }
          delete: {
            args: Prisma.AccesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccesPayload>
          }
          update: {
            args: Prisma.AccesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccesPayload>
          }
          deleteMany: {
            args: Prisma.AccesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AccesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AccesUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccesPayload>[]
          }
          upsert: {
            args: Prisma.AccesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccesPayload>
          }
          aggregate: {
            args: Prisma.AccesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAcces>
          }
          groupBy: {
            args: Prisma.AccesGroupByArgs<ExtArgs>
            result: $Utils.Optional<AccesGroupByOutputType>[]
          }
          count: {
            args: Prisma.AccesCountArgs<ExtArgs>
            result: $Utils.Optional<AccesCountAggregateOutputType> | number
          }
        }
      }
      Message: {
        payload: Prisma.$MessagePayload<ExtArgs>
        fields: Prisma.MessageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MessageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MessageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          findFirst: {
            args: Prisma.MessageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MessageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          findMany: {
            args: Prisma.MessageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>[]
          }
          create: {
            args: Prisma.MessageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          createMany: {
            args: Prisma.MessageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MessageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>[]
          }
          delete: {
            args: Prisma.MessageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          update: {
            args: Prisma.MessageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          deleteMany: {
            args: Prisma.MessageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MessageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MessageUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>[]
          }
          upsert: {
            args: Prisma.MessageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          aggregate: {
            args: Prisma.MessageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMessage>
          }
          groupBy: {
            args: Prisma.MessageGroupByArgs<ExtArgs>
            result: $Utils.Optional<MessageGroupByOutputType>[]
          }
          count: {
            args: Prisma.MessageCountArgs<ExtArgs>
            result: $Utils.Optional<MessageCountAggregateOutputType> | number
          }
        }
      }
      AuditLog: {
        payload: Prisma.$AuditLogPayload<ExtArgs>
        fields: Prisma.AuditLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuditLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuditLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findFirst: {
            args: Prisma.AuditLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuditLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findMany: {
            args: Prisma.AuditLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          create: {
            args: Prisma.AuditLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          createMany: {
            args: Prisma.AuditLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AuditLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          delete: {
            args: Prisma.AuditLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          update: {
            args: Prisma.AuditLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          deleteMany: {
            args: Prisma.AuditLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuditLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AuditLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          upsert: {
            args: Prisma.AuditLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          aggregate: {
            args: Prisma.AuditLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuditLog>
          }
          groupBy: {
            args: Prisma.AuditLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuditLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuditLogCountArgs<ExtArgs>
            result: $Utils.Optional<AuditLogCountAggregateOutputType> | number
          }
        }
      }
      ErrorReport: {
        payload: Prisma.$ErrorReportPayload<ExtArgs>
        fields: Prisma.ErrorReportFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ErrorReportFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ErrorReportPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ErrorReportFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ErrorReportPayload>
          }
          findFirst: {
            args: Prisma.ErrorReportFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ErrorReportPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ErrorReportFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ErrorReportPayload>
          }
          findMany: {
            args: Prisma.ErrorReportFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ErrorReportPayload>[]
          }
          create: {
            args: Prisma.ErrorReportCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ErrorReportPayload>
          }
          createMany: {
            args: Prisma.ErrorReportCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ErrorReportCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ErrorReportPayload>[]
          }
          delete: {
            args: Prisma.ErrorReportDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ErrorReportPayload>
          }
          update: {
            args: Prisma.ErrorReportUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ErrorReportPayload>
          }
          deleteMany: {
            args: Prisma.ErrorReportDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ErrorReportUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ErrorReportUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ErrorReportPayload>[]
          }
          upsert: {
            args: Prisma.ErrorReportUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ErrorReportPayload>
          }
          aggregate: {
            args: Prisma.ErrorReportAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateErrorReport>
          }
          groupBy: {
            args: Prisma.ErrorReportGroupByArgs<ExtArgs>
            result: $Utils.Optional<ErrorReportGroupByOutputType>[]
          }
          count: {
            args: Prisma.ErrorReportCountArgs<ExtArgs>
            result: $Utils.Optional<ErrorReportCountAggregateOutputType> | number
          }
        }
      }
      FinanceSettings: {
        payload: Prisma.$FinanceSettingsPayload<ExtArgs>
        fields: Prisma.FinanceSettingsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FinanceSettingsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FinanceSettingsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FinanceSettingsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FinanceSettingsPayload>
          }
          findFirst: {
            args: Prisma.FinanceSettingsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FinanceSettingsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FinanceSettingsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FinanceSettingsPayload>
          }
          findMany: {
            args: Prisma.FinanceSettingsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FinanceSettingsPayload>[]
          }
          create: {
            args: Prisma.FinanceSettingsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FinanceSettingsPayload>
          }
          createMany: {
            args: Prisma.FinanceSettingsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FinanceSettingsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FinanceSettingsPayload>[]
          }
          delete: {
            args: Prisma.FinanceSettingsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FinanceSettingsPayload>
          }
          update: {
            args: Prisma.FinanceSettingsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FinanceSettingsPayload>
          }
          deleteMany: {
            args: Prisma.FinanceSettingsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FinanceSettingsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FinanceSettingsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FinanceSettingsPayload>[]
          }
          upsert: {
            args: Prisma.FinanceSettingsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FinanceSettingsPayload>
          }
          aggregate: {
            args: Prisma.FinanceSettingsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFinanceSettings>
          }
          groupBy: {
            args: Prisma.FinanceSettingsGroupByArgs<ExtArgs>
            result: $Utils.Optional<FinanceSettingsGroupByOutputType>[]
          }
          count: {
            args: Prisma.FinanceSettingsCountArgs<ExtArgs>
            result: $Utils.Optional<FinanceSettingsCountAggregateOutputType> | number
          }
        }
      }
      LysmaExpense: {
        payload: Prisma.$LysmaExpensePayload<ExtArgs>
        fields: Prisma.LysmaExpenseFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LysmaExpenseFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LysmaExpensePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LysmaExpenseFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LysmaExpensePayload>
          }
          findFirst: {
            args: Prisma.LysmaExpenseFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LysmaExpensePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LysmaExpenseFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LysmaExpensePayload>
          }
          findMany: {
            args: Prisma.LysmaExpenseFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LysmaExpensePayload>[]
          }
          create: {
            args: Prisma.LysmaExpenseCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LysmaExpensePayload>
          }
          createMany: {
            args: Prisma.LysmaExpenseCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LysmaExpenseCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LysmaExpensePayload>[]
          }
          delete: {
            args: Prisma.LysmaExpenseDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LysmaExpensePayload>
          }
          update: {
            args: Prisma.LysmaExpenseUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LysmaExpensePayload>
          }
          deleteMany: {
            args: Prisma.LysmaExpenseDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LysmaExpenseUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LysmaExpenseUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LysmaExpensePayload>[]
          }
          upsert: {
            args: Prisma.LysmaExpenseUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LysmaExpensePayload>
          }
          aggregate: {
            args: Prisma.LysmaExpenseAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLysmaExpense>
          }
          groupBy: {
            args: Prisma.LysmaExpenseGroupByArgs<ExtArgs>
            result: $Utils.Optional<LysmaExpenseGroupByOutputType>[]
          }
          count: {
            args: Prisma.LysmaExpenseCountArgs<ExtArgs>
            result: $Utils.Optional<LysmaExpenseCountAggregateOutputType> | number
          }
        }
      }
      RevenueSubscription: {
        payload: Prisma.$RevenueSubscriptionPayload<ExtArgs>
        fields: Prisma.RevenueSubscriptionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RevenueSubscriptionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RevenueSubscriptionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RevenueSubscriptionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RevenueSubscriptionPayload>
          }
          findFirst: {
            args: Prisma.RevenueSubscriptionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RevenueSubscriptionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RevenueSubscriptionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RevenueSubscriptionPayload>
          }
          findMany: {
            args: Prisma.RevenueSubscriptionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RevenueSubscriptionPayload>[]
          }
          create: {
            args: Prisma.RevenueSubscriptionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RevenueSubscriptionPayload>
          }
          createMany: {
            args: Prisma.RevenueSubscriptionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RevenueSubscriptionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RevenueSubscriptionPayload>[]
          }
          delete: {
            args: Prisma.RevenueSubscriptionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RevenueSubscriptionPayload>
          }
          update: {
            args: Prisma.RevenueSubscriptionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RevenueSubscriptionPayload>
          }
          deleteMany: {
            args: Prisma.RevenueSubscriptionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RevenueSubscriptionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RevenueSubscriptionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RevenueSubscriptionPayload>[]
          }
          upsert: {
            args: Prisma.RevenueSubscriptionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RevenueSubscriptionPayload>
          }
          aggregate: {
            args: Prisma.RevenueSubscriptionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRevenueSubscription>
          }
          groupBy: {
            args: Prisma.RevenueSubscriptionGroupByArgs<ExtArgs>
            result: $Utils.Optional<RevenueSubscriptionGroupByOutputType>[]
          }
          count: {
            args: Prisma.RevenueSubscriptionCountArgs<ExtArgs>
            result: $Utils.Optional<RevenueSubscriptionCountAggregateOutputType> | number
          }
        }
      }
      FinanceInvoice: {
        payload: Prisma.$FinanceInvoicePayload<ExtArgs>
        fields: Prisma.FinanceInvoiceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FinanceInvoiceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FinanceInvoicePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FinanceInvoiceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FinanceInvoicePayload>
          }
          findFirst: {
            args: Prisma.FinanceInvoiceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FinanceInvoicePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FinanceInvoiceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FinanceInvoicePayload>
          }
          findMany: {
            args: Prisma.FinanceInvoiceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FinanceInvoicePayload>[]
          }
          create: {
            args: Prisma.FinanceInvoiceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FinanceInvoicePayload>
          }
          createMany: {
            args: Prisma.FinanceInvoiceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FinanceInvoiceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FinanceInvoicePayload>[]
          }
          delete: {
            args: Prisma.FinanceInvoiceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FinanceInvoicePayload>
          }
          update: {
            args: Prisma.FinanceInvoiceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FinanceInvoicePayload>
          }
          deleteMany: {
            args: Prisma.FinanceInvoiceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FinanceInvoiceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FinanceInvoiceUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FinanceInvoicePayload>[]
          }
          upsert: {
            args: Prisma.FinanceInvoiceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FinanceInvoicePayload>
          }
          aggregate: {
            args: Prisma.FinanceInvoiceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFinanceInvoice>
          }
          groupBy: {
            args: Prisma.FinanceInvoiceGroupByArgs<ExtArgs>
            result: $Utils.Optional<FinanceInvoiceGroupByOutputType>[]
          }
          count: {
            args: Prisma.FinanceInvoiceCountArgs<ExtArgs>
            result: $Utils.Optional<FinanceInvoiceCountAggregateOutputType> | number
          }
        }
      }
      FinancePayment: {
        payload: Prisma.$FinancePaymentPayload<ExtArgs>
        fields: Prisma.FinancePaymentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FinancePaymentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FinancePaymentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FinancePaymentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FinancePaymentPayload>
          }
          findFirst: {
            args: Prisma.FinancePaymentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FinancePaymentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FinancePaymentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FinancePaymentPayload>
          }
          findMany: {
            args: Prisma.FinancePaymentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FinancePaymentPayload>[]
          }
          create: {
            args: Prisma.FinancePaymentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FinancePaymentPayload>
          }
          createMany: {
            args: Prisma.FinancePaymentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FinancePaymentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FinancePaymentPayload>[]
          }
          delete: {
            args: Prisma.FinancePaymentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FinancePaymentPayload>
          }
          update: {
            args: Prisma.FinancePaymentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FinancePaymentPayload>
          }
          deleteMany: {
            args: Prisma.FinancePaymentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FinancePaymentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FinancePaymentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FinancePaymentPayload>[]
          }
          upsert: {
            args: Prisma.FinancePaymentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FinancePaymentPayload>
          }
          aggregate: {
            args: Prisma.FinancePaymentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFinancePayment>
          }
          groupBy: {
            args: Prisma.FinancePaymentGroupByArgs<ExtArgs>
            result: $Utils.Optional<FinancePaymentGroupByOutputType>[]
          }
          count: {
            args: Prisma.FinancePaymentCountArgs<ExtArgs>
            result: $Utils.Optional<FinancePaymentCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    adminUser?: AdminUserOmit
    client?: ClientOmit
    acces?: AccesOmit
    message?: MessageOmit
    auditLog?: AuditLogOmit
    errorReport?: ErrorReportOmit
    financeSettings?: FinanceSettingsOmit
    lysmaExpense?: LysmaExpenseOmit
    revenueSubscription?: RevenueSubscriptionOmit
    financeInvoice?: FinanceInvoiceOmit
    financePayment?: FinancePaymentOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type ClientCountOutputType
   */

  export type ClientCountOutputType = {
    acces: number
    messages: number
  }

  export type ClientCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    acces?: boolean | ClientCountOutputTypeCountAccesArgs
    messages?: boolean | ClientCountOutputTypeCountMessagesArgs
  }

  // Custom InputTypes
  /**
   * ClientCountOutputType without action
   */
  export type ClientCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClientCountOutputType
     */
    select?: ClientCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ClientCountOutputType without action
   */
  export type ClientCountOutputTypeCountAccesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccesWhereInput
  }

  /**
   * ClientCountOutputType without action
   */
  export type ClientCountOutputTypeCountMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MessageWhereInput
  }


  /**
   * Count Type RevenueSubscriptionCountOutputType
   */

  export type RevenueSubscriptionCountOutputType = {
    payments: number
  }

  export type RevenueSubscriptionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    payments?: boolean | RevenueSubscriptionCountOutputTypeCountPaymentsArgs
  }

  // Custom InputTypes
  /**
   * RevenueSubscriptionCountOutputType without action
   */
  export type RevenueSubscriptionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RevenueSubscriptionCountOutputType
     */
    select?: RevenueSubscriptionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * RevenueSubscriptionCountOutputType without action
   */
  export type RevenueSubscriptionCountOutputTypeCountPaymentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FinancePaymentWhereInput
  }


  /**
   * Count Type FinanceInvoiceCountOutputType
   */

  export type FinanceInvoiceCountOutputType = {
    payments: number
  }

  export type FinanceInvoiceCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    payments?: boolean | FinanceInvoiceCountOutputTypeCountPaymentsArgs
  }

  // Custom InputTypes
  /**
   * FinanceInvoiceCountOutputType without action
   */
  export type FinanceInvoiceCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FinanceInvoiceCountOutputType
     */
    select?: FinanceInvoiceCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * FinanceInvoiceCountOutputType without action
   */
  export type FinanceInvoiceCountOutputTypeCountPaymentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FinancePaymentWhereInput
  }


  /**
   * Models
   */

  /**
   * Model AdminUser
   */

  export type AggregateAdminUser = {
    _count: AdminUserCountAggregateOutputType | null
    _min: AdminUserMinAggregateOutputType | null
    _max: AdminUserMaxAggregateOutputType | null
  }

  export type AdminUserMinAggregateOutputType = {
    id: string | null
    email: string | null
    passwordHash: string | null
    nom: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AdminUserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    passwordHash: string | null
    nom: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AdminUserCountAggregateOutputType = {
    id: number
    email: number
    passwordHash: number
    nom: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AdminUserMinAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    nom?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AdminUserMaxAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    nom?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AdminUserCountAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    nom?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AdminUserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AdminUser to aggregate.
     */
    where?: AdminUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdminUsers to fetch.
     */
    orderBy?: AdminUserOrderByWithRelationInput | AdminUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AdminUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdminUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdminUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AdminUsers
    **/
    _count?: true | AdminUserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AdminUserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AdminUserMaxAggregateInputType
  }

  export type GetAdminUserAggregateType<T extends AdminUserAggregateArgs> = {
        [P in keyof T & keyof AggregateAdminUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAdminUser[P]>
      : GetScalarType<T[P], AggregateAdminUser[P]>
  }




  export type AdminUserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AdminUserWhereInput
    orderBy?: AdminUserOrderByWithAggregationInput | AdminUserOrderByWithAggregationInput[]
    by: AdminUserScalarFieldEnum[] | AdminUserScalarFieldEnum
    having?: AdminUserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AdminUserCountAggregateInputType | true
    _min?: AdminUserMinAggregateInputType
    _max?: AdminUserMaxAggregateInputType
  }

  export type AdminUserGroupByOutputType = {
    id: string
    email: string
    passwordHash: string
    nom: string
    createdAt: Date
    updatedAt: Date
    _count: AdminUserCountAggregateOutputType | null
    _min: AdminUserMinAggregateOutputType | null
    _max: AdminUserMaxAggregateOutputType | null
  }

  type GetAdminUserGroupByPayload<T extends AdminUserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AdminUserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AdminUserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AdminUserGroupByOutputType[P]>
            : GetScalarType<T[P], AdminUserGroupByOutputType[P]>
        }
      >
    >


  export type AdminUserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    nom?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["adminUser"]>

  export type AdminUserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    nom?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["adminUser"]>

  export type AdminUserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    nom?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["adminUser"]>

  export type AdminUserSelectScalar = {
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    nom?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AdminUserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "passwordHash" | "nom" | "createdAt" | "updatedAt", ExtArgs["result"]["adminUser"]>

  export type $AdminUserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AdminUser"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      passwordHash: string
      nom: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["adminUser"]>
    composites: {}
  }

  type AdminUserGetPayload<S extends boolean | null | undefined | AdminUserDefaultArgs> = $Result.GetResult<Prisma.$AdminUserPayload, S>

  type AdminUserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AdminUserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AdminUserCountAggregateInputType | true
    }

  export interface AdminUserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AdminUser'], meta: { name: 'AdminUser' } }
    /**
     * Find zero or one AdminUser that matches the filter.
     * @param {AdminUserFindUniqueArgs} args - Arguments to find a AdminUser
     * @example
     * // Get one AdminUser
     * const adminUser = await prisma.adminUser.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AdminUserFindUniqueArgs>(args: SelectSubset<T, AdminUserFindUniqueArgs<ExtArgs>>): Prisma__AdminUserClient<$Result.GetResult<Prisma.$AdminUserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AdminUser that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AdminUserFindUniqueOrThrowArgs} args - Arguments to find a AdminUser
     * @example
     * // Get one AdminUser
     * const adminUser = await prisma.adminUser.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AdminUserFindUniqueOrThrowArgs>(args: SelectSubset<T, AdminUserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AdminUserClient<$Result.GetResult<Prisma.$AdminUserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AdminUser that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminUserFindFirstArgs} args - Arguments to find a AdminUser
     * @example
     * // Get one AdminUser
     * const adminUser = await prisma.adminUser.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AdminUserFindFirstArgs>(args?: SelectSubset<T, AdminUserFindFirstArgs<ExtArgs>>): Prisma__AdminUserClient<$Result.GetResult<Prisma.$AdminUserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AdminUser that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminUserFindFirstOrThrowArgs} args - Arguments to find a AdminUser
     * @example
     * // Get one AdminUser
     * const adminUser = await prisma.adminUser.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AdminUserFindFirstOrThrowArgs>(args?: SelectSubset<T, AdminUserFindFirstOrThrowArgs<ExtArgs>>): Prisma__AdminUserClient<$Result.GetResult<Prisma.$AdminUserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AdminUsers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminUserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AdminUsers
     * const adminUsers = await prisma.adminUser.findMany()
     * 
     * // Get first 10 AdminUsers
     * const adminUsers = await prisma.adminUser.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const adminUserWithIdOnly = await prisma.adminUser.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AdminUserFindManyArgs>(args?: SelectSubset<T, AdminUserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AdminUserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AdminUser.
     * @param {AdminUserCreateArgs} args - Arguments to create a AdminUser.
     * @example
     * // Create one AdminUser
     * const AdminUser = await prisma.adminUser.create({
     *   data: {
     *     // ... data to create a AdminUser
     *   }
     * })
     * 
     */
    create<T extends AdminUserCreateArgs>(args: SelectSubset<T, AdminUserCreateArgs<ExtArgs>>): Prisma__AdminUserClient<$Result.GetResult<Prisma.$AdminUserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AdminUsers.
     * @param {AdminUserCreateManyArgs} args - Arguments to create many AdminUsers.
     * @example
     * // Create many AdminUsers
     * const adminUser = await prisma.adminUser.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AdminUserCreateManyArgs>(args?: SelectSubset<T, AdminUserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AdminUsers and returns the data saved in the database.
     * @param {AdminUserCreateManyAndReturnArgs} args - Arguments to create many AdminUsers.
     * @example
     * // Create many AdminUsers
     * const adminUser = await prisma.adminUser.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AdminUsers and only return the `id`
     * const adminUserWithIdOnly = await prisma.adminUser.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AdminUserCreateManyAndReturnArgs>(args?: SelectSubset<T, AdminUserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AdminUserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AdminUser.
     * @param {AdminUserDeleteArgs} args - Arguments to delete one AdminUser.
     * @example
     * // Delete one AdminUser
     * const AdminUser = await prisma.adminUser.delete({
     *   where: {
     *     // ... filter to delete one AdminUser
     *   }
     * })
     * 
     */
    delete<T extends AdminUserDeleteArgs>(args: SelectSubset<T, AdminUserDeleteArgs<ExtArgs>>): Prisma__AdminUserClient<$Result.GetResult<Prisma.$AdminUserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AdminUser.
     * @param {AdminUserUpdateArgs} args - Arguments to update one AdminUser.
     * @example
     * // Update one AdminUser
     * const adminUser = await prisma.adminUser.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AdminUserUpdateArgs>(args: SelectSubset<T, AdminUserUpdateArgs<ExtArgs>>): Prisma__AdminUserClient<$Result.GetResult<Prisma.$AdminUserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AdminUsers.
     * @param {AdminUserDeleteManyArgs} args - Arguments to filter AdminUsers to delete.
     * @example
     * // Delete a few AdminUsers
     * const { count } = await prisma.adminUser.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AdminUserDeleteManyArgs>(args?: SelectSubset<T, AdminUserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AdminUsers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminUserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AdminUsers
     * const adminUser = await prisma.adminUser.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AdminUserUpdateManyArgs>(args: SelectSubset<T, AdminUserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AdminUsers and returns the data updated in the database.
     * @param {AdminUserUpdateManyAndReturnArgs} args - Arguments to update many AdminUsers.
     * @example
     * // Update many AdminUsers
     * const adminUser = await prisma.adminUser.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AdminUsers and only return the `id`
     * const adminUserWithIdOnly = await prisma.adminUser.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AdminUserUpdateManyAndReturnArgs>(args: SelectSubset<T, AdminUserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AdminUserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AdminUser.
     * @param {AdminUserUpsertArgs} args - Arguments to update or create a AdminUser.
     * @example
     * // Update or create a AdminUser
     * const adminUser = await prisma.adminUser.upsert({
     *   create: {
     *     // ... data to create a AdminUser
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AdminUser we want to update
     *   }
     * })
     */
    upsert<T extends AdminUserUpsertArgs>(args: SelectSubset<T, AdminUserUpsertArgs<ExtArgs>>): Prisma__AdminUserClient<$Result.GetResult<Prisma.$AdminUserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AdminUsers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminUserCountArgs} args - Arguments to filter AdminUsers to count.
     * @example
     * // Count the number of AdminUsers
     * const count = await prisma.adminUser.count({
     *   where: {
     *     // ... the filter for the AdminUsers we want to count
     *   }
     * })
    **/
    count<T extends AdminUserCountArgs>(
      args?: Subset<T, AdminUserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AdminUserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AdminUser.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminUserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AdminUserAggregateArgs>(args: Subset<T, AdminUserAggregateArgs>): Prisma.PrismaPromise<GetAdminUserAggregateType<T>>

    /**
     * Group by AdminUser.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminUserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AdminUserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AdminUserGroupByArgs['orderBy'] }
        : { orderBy?: AdminUserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AdminUserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAdminUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AdminUser model
   */
  readonly fields: AdminUserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AdminUser.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AdminUserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AdminUser model
   */
  interface AdminUserFieldRefs {
    readonly id: FieldRef<"AdminUser", 'String'>
    readonly email: FieldRef<"AdminUser", 'String'>
    readonly passwordHash: FieldRef<"AdminUser", 'String'>
    readonly nom: FieldRef<"AdminUser", 'String'>
    readonly createdAt: FieldRef<"AdminUser", 'DateTime'>
    readonly updatedAt: FieldRef<"AdminUser", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AdminUser findUnique
   */
  export type AdminUserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminUser
     */
    select?: AdminUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminUser
     */
    omit?: AdminUserOmit<ExtArgs> | null
    /**
     * Filter, which AdminUser to fetch.
     */
    where: AdminUserWhereUniqueInput
  }

  /**
   * AdminUser findUniqueOrThrow
   */
  export type AdminUserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminUser
     */
    select?: AdminUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminUser
     */
    omit?: AdminUserOmit<ExtArgs> | null
    /**
     * Filter, which AdminUser to fetch.
     */
    where: AdminUserWhereUniqueInput
  }

  /**
   * AdminUser findFirst
   */
  export type AdminUserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminUser
     */
    select?: AdminUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminUser
     */
    omit?: AdminUserOmit<ExtArgs> | null
    /**
     * Filter, which AdminUser to fetch.
     */
    where?: AdminUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdminUsers to fetch.
     */
    orderBy?: AdminUserOrderByWithRelationInput | AdminUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AdminUsers.
     */
    cursor?: AdminUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdminUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdminUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AdminUsers.
     */
    distinct?: AdminUserScalarFieldEnum | AdminUserScalarFieldEnum[]
  }

  /**
   * AdminUser findFirstOrThrow
   */
  export type AdminUserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminUser
     */
    select?: AdminUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminUser
     */
    omit?: AdminUserOmit<ExtArgs> | null
    /**
     * Filter, which AdminUser to fetch.
     */
    where?: AdminUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdminUsers to fetch.
     */
    orderBy?: AdminUserOrderByWithRelationInput | AdminUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AdminUsers.
     */
    cursor?: AdminUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdminUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdminUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AdminUsers.
     */
    distinct?: AdminUserScalarFieldEnum | AdminUserScalarFieldEnum[]
  }

  /**
   * AdminUser findMany
   */
  export type AdminUserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminUser
     */
    select?: AdminUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminUser
     */
    omit?: AdminUserOmit<ExtArgs> | null
    /**
     * Filter, which AdminUsers to fetch.
     */
    where?: AdminUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdminUsers to fetch.
     */
    orderBy?: AdminUserOrderByWithRelationInput | AdminUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AdminUsers.
     */
    cursor?: AdminUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdminUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdminUsers.
     */
    skip?: number
    distinct?: AdminUserScalarFieldEnum | AdminUserScalarFieldEnum[]
  }

  /**
   * AdminUser create
   */
  export type AdminUserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminUser
     */
    select?: AdminUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminUser
     */
    omit?: AdminUserOmit<ExtArgs> | null
    /**
     * The data needed to create a AdminUser.
     */
    data: XOR<AdminUserCreateInput, AdminUserUncheckedCreateInput>
  }

  /**
   * AdminUser createMany
   */
  export type AdminUserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AdminUsers.
     */
    data: AdminUserCreateManyInput | AdminUserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AdminUser createManyAndReturn
   */
  export type AdminUserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminUser
     */
    select?: AdminUserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AdminUser
     */
    omit?: AdminUserOmit<ExtArgs> | null
    /**
     * The data used to create many AdminUsers.
     */
    data: AdminUserCreateManyInput | AdminUserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AdminUser update
   */
  export type AdminUserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminUser
     */
    select?: AdminUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminUser
     */
    omit?: AdminUserOmit<ExtArgs> | null
    /**
     * The data needed to update a AdminUser.
     */
    data: XOR<AdminUserUpdateInput, AdminUserUncheckedUpdateInput>
    /**
     * Choose, which AdminUser to update.
     */
    where: AdminUserWhereUniqueInput
  }

  /**
   * AdminUser updateMany
   */
  export type AdminUserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AdminUsers.
     */
    data: XOR<AdminUserUpdateManyMutationInput, AdminUserUncheckedUpdateManyInput>
    /**
     * Filter which AdminUsers to update
     */
    where?: AdminUserWhereInput
    /**
     * Limit how many AdminUsers to update.
     */
    limit?: number
  }

  /**
   * AdminUser updateManyAndReturn
   */
  export type AdminUserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminUser
     */
    select?: AdminUserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AdminUser
     */
    omit?: AdminUserOmit<ExtArgs> | null
    /**
     * The data used to update AdminUsers.
     */
    data: XOR<AdminUserUpdateManyMutationInput, AdminUserUncheckedUpdateManyInput>
    /**
     * Filter which AdminUsers to update
     */
    where?: AdminUserWhereInput
    /**
     * Limit how many AdminUsers to update.
     */
    limit?: number
  }

  /**
   * AdminUser upsert
   */
  export type AdminUserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminUser
     */
    select?: AdminUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminUser
     */
    omit?: AdminUserOmit<ExtArgs> | null
    /**
     * The filter to search for the AdminUser to update in case it exists.
     */
    where: AdminUserWhereUniqueInput
    /**
     * In case the AdminUser found by the `where` argument doesn't exist, create a new AdminUser with this data.
     */
    create: XOR<AdminUserCreateInput, AdminUserUncheckedCreateInput>
    /**
     * In case the AdminUser was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AdminUserUpdateInput, AdminUserUncheckedUpdateInput>
  }

  /**
   * AdminUser delete
   */
  export type AdminUserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminUser
     */
    select?: AdminUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminUser
     */
    omit?: AdminUserOmit<ExtArgs> | null
    /**
     * Filter which AdminUser to delete.
     */
    where: AdminUserWhereUniqueInput
  }

  /**
   * AdminUser deleteMany
   */
  export type AdminUserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AdminUsers to delete
     */
    where?: AdminUserWhereInput
    /**
     * Limit how many AdminUsers to delete.
     */
    limit?: number
  }

  /**
   * AdminUser without action
   */
  export type AdminUserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminUser
     */
    select?: AdminUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminUser
     */
    omit?: AdminUserOmit<ExtArgs> | null
  }


  /**
   * Model Client
   */

  export type AggregateClient = {
    _count: ClientCountAggregateOutputType | null
    _min: ClientMinAggregateOutputType | null
    _max: ClientMaxAggregateOutputType | null
  }

  export type ClientMinAggregateOutputType = {
    id: string | null
    nom: string | null
    email: string | null
    telephone: string | null
    societe: string | null
    outil: string | null
    statut: $Enums.ClientStatut | null
    abonnement: string | null
    trialDebutAt: Date | null
    trialFinAt: Date | null
    abonnementActif: boolean | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ClientMaxAggregateOutputType = {
    id: string | null
    nom: string | null
    email: string | null
    telephone: string | null
    societe: string | null
    outil: string | null
    statut: $Enums.ClientStatut | null
    abonnement: string | null
    trialDebutAt: Date | null
    trialFinAt: Date | null
    abonnementActif: boolean | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ClientCountAggregateOutputType = {
    id: number
    nom: number
    email: number
    telephone: number
    societe: number
    outil: number
    statut: number
    abonnement: number
    trialDebutAt: number
    trialFinAt: number
    abonnementActif: number
    notes: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ClientMinAggregateInputType = {
    id?: true
    nom?: true
    email?: true
    telephone?: true
    societe?: true
    outil?: true
    statut?: true
    abonnement?: true
    trialDebutAt?: true
    trialFinAt?: true
    abonnementActif?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ClientMaxAggregateInputType = {
    id?: true
    nom?: true
    email?: true
    telephone?: true
    societe?: true
    outil?: true
    statut?: true
    abonnement?: true
    trialDebutAt?: true
    trialFinAt?: true
    abonnementActif?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ClientCountAggregateInputType = {
    id?: true
    nom?: true
    email?: true
    telephone?: true
    societe?: true
    outil?: true
    statut?: true
    abonnement?: true
    trialDebutAt?: true
    trialFinAt?: true
    abonnementActif?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ClientAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Client to aggregate.
     */
    where?: ClientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clients to fetch.
     */
    orderBy?: ClientOrderByWithRelationInput | ClientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ClientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Clients
    **/
    _count?: true | ClientCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ClientMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ClientMaxAggregateInputType
  }

  export type GetClientAggregateType<T extends ClientAggregateArgs> = {
        [P in keyof T & keyof AggregateClient]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateClient[P]>
      : GetScalarType<T[P], AggregateClient[P]>
  }




  export type ClientGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClientWhereInput
    orderBy?: ClientOrderByWithAggregationInput | ClientOrderByWithAggregationInput[]
    by: ClientScalarFieldEnum[] | ClientScalarFieldEnum
    having?: ClientScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ClientCountAggregateInputType | true
    _min?: ClientMinAggregateInputType
    _max?: ClientMaxAggregateInputType
  }

  export type ClientGroupByOutputType = {
    id: string
    nom: string
    email: string
    telephone: string | null
    societe: string | null
    outil: string
    statut: $Enums.ClientStatut
    abonnement: string | null
    trialDebutAt: Date | null
    trialFinAt: Date | null
    abonnementActif: boolean
    notes: string | null
    createdAt: Date
    updatedAt: Date
    _count: ClientCountAggregateOutputType | null
    _min: ClientMinAggregateOutputType | null
    _max: ClientMaxAggregateOutputType | null
  }

  type GetClientGroupByPayload<T extends ClientGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ClientGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ClientGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ClientGroupByOutputType[P]>
            : GetScalarType<T[P], ClientGroupByOutputType[P]>
        }
      >
    >


  export type ClientSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nom?: boolean
    email?: boolean
    telephone?: boolean
    societe?: boolean
    outil?: boolean
    statut?: boolean
    abonnement?: boolean
    trialDebutAt?: boolean
    trialFinAt?: boolean
    abonnementActif?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    acces?: boolean | Client$accesArgs<ExtArgs>
    messages?: boolean | Client$messagesArgs<ExtArgs>
    _count?: boolean | ClientCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["client"]>

  export type ClientSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nom?: boolean
    email?: boolean
    telephone?: boolean
    societe?: boolean
    outil?: boolean
    statut?: boolean
    abonnement?: boolean
    trialDebutAt?: boolean
    trialFinAt?: boolean
    abonnementActif?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["client"]>

  export type ClientSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nom?: boolean
    email?: boolean
    telephone?: boolean
    societe?: boolean
    outil?: boolean
    statut?: boolean
    abonnement?: boolean
    trialDebutAt?: boolean
    trialFinAt?: boolean
    abonnementActif?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["client"]>

  export type ClientSelectScalar = {
    id?: boolean
    nom?: boolean
    email?: boolean
    telephone?: boolean
    societe?: boolean
    outil?: boolean
    statut?: boolean
    abonnement?: boolean
    trialDebutAt?: boolean
    trialFinAt?: boolean
    abonnementActif?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ClientOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "nom" | "email" | "telephone" | "societe" | "outil" | "statut" | "abonnement" | "trialDebutAt" | "trialFinAt" | "abonnementActif" | "notes" | "createdAt" | "updatedAt", ExtArgs["result"]["client"]>
  export type ClientInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    acces?: boolean | Client$accesArgs<ExtArgs>
    messages?: boolean | Client$messagesArgs<ExtArgs>
    _count?: boolean | ClientCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ClientIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ClientIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ClientPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Client"
    objects: {
      acces: Prisma.$AccesPayload<ExtArgs>[]
      messages: Prisma.$MessagePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      nom: string
      email: string
      telephone: string | null
      societe: string | null
      outil: string
      statut: $Enums.ClientStatut
      abonnement: string | null
      trialDebutAt: Date | null
      trialFinAt: Date | null
      abonnementActif: boolean
      notes: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["client"]>
    composites: {}
  }

  type ClientGetPayload<S extends boolean | null | undefined | ClientDefaultArgs> = $Result.GetResult<Prisma.$ClientPayload, S>

  type ClientCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ClientFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ClientCountAggregateInputType | true
    }

  export interface ClientDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Client'], meta: { name: 'Client' } }
    /**
     * Find zero or one Client that matches the filter.
     * @param {ClientFindUniqueArgs} args - Arguments to find a Client
     * @example
     * // Get one Client
     * const client = await prisma.client.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ClientFindUniqueArgs>(args: SelectSubset<T, ClientFindUniqueArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Client that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ClientFindUniqueOrThrowArgs} args - Arguments to find a Client
     * @example
     * // Get one Client
     * const client = await prisma.client.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ClientFindUniqueOrThrowArgs>(args: SelectSubset<T, ClientFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Client that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientFindFirstArgs} args - Arguments to find a Client
     * @example
     * // Get one Client
     * const client = await prisma.client.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ClientFindFirstArgs>(args?: SelectSubset<T, ClientFindFirstArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Client that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientFindFirstOrThrowArgs} args - Arguments to find a Client
     * @example
     * // Get one Client
     * const client = await prisma.client.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ClientFindFirstOrThrowArgs>(args?: SelectSubset<T, ClientFindFirstOrThrowArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Clients that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Clients
     * const clients = await prisma.client.findMany()
     * 
     * // Get first 10 Clients
     * const clients = await prisma.client.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const clientWithIdOnly = await prisma.client.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ClientFindManyArgs>(args?: SelectSubset<T, ClientFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Client.
     * @param {ClientCreateArgs} args - Arguments to create a Client.
     * @example
     * // Create one Client
     * const Client = await prisma.client.create({
     *   data: {
     *     // ... data to create a Client
     *   }
     * })
     * 
     */
    create<T extends ClientCreateArgs>(args: SelectSubset<T, ClientCreateArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Clients.
     * @param {ClientCreateManyArgs} args - Arguments to create many Clients.
     * @example
     * // Create many Clients
     * const client = await prisma.client.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ClientCreateManyArgs>(args?: SelectSubset<T, ClientCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Clients and returns the data saved in the database.
     * @param {ClientCreateManyAndReturnArgs} args - Arguments to create many Clients.
     * @example
     * // Create many Clients
     * const client = await prisma.client.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Clients and only return the `id`
     * const clientWithIdOnly = await prisma.client.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ClientCreateManyAndReturnArgs>(args?: SelectSubset<T, ClientCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Client.
     * @param {ClientDeleteArgs} args - Arguments to delete one Client.
     * @example
     * // Delete one Client
     * const Client = await prisma.client.delete({
     *   where: {
     *     // ... filter to delete one Client
     *   }
     * })
     * 
     */
    delete<T extends ClientDeleteArgs>(args: SelectSubset<T, ClientDeleteArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Client.
     * @param {ClientUpdateArgs} args - Arguments to update one Client.
     * @example
     * // Update one Client
     * const client = await prisma.client.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ClientUpdateArgs>(args: SelectSubset<T, ClientUpdateArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Clients.
     * @param {ClientDeleteManyArgs} args - Arguments to filter Clients to delete.
     * @example
     * // Delete a few Clients
     * const { count } = await prisma.client.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ClientDeleteManyArgs>(args?: SelectSubset<T, ClientDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Clients.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Clients
     * const client = await prisma.client.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ClientUpdateManyArgs>(args: SelectSubset<T, ClientUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Clients and returns the data updated in the database.
     * @param {ClientUpdateManyAndReturnArgs} args - Arguments to update many Clients.
     * @example
     * // Update many Clients
     * const client = await prisma.client.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Clients and only return the `id`
     * const clientWithIdOnly = await prisma.client.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ClientUpdateManyAndReturnArgs>(args: SelectSubset<T, ClientUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Client.
     * @param {ClientUpsertArgs} args - Arguments to update or create a Client.
     * @example
     * // Update or create a Client
     * const client = await prisma.client.upsert({
     *   create: {
     *     // ... data to create a Client
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Client we want to update
     *   }
     * })
     */
    upsert<T extends ClientUpsertArgs>(args: SelectSubset<T, ClientUpsertArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Clients.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientCountArgs} args - Arguments to filter Clients to count.
     * @example
     * // Count the number of Clients
     * const count = await prisma.client.count({
     *   where: {
     *     // ... the filter for the Clients we want to count
     *   }
     * })
    **/
    count<T extends ClientCountArgs>(
      args?: Subset<T, ClientCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ClientCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Client.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ClientAggregateArgs>(args: Subset<T, ClientAggregateArgs>): Prisma.PrismaPromise<GetClientAggregateType<T>>

    /**
     * Group by Client.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ClientGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ClientGroupByArgs['orderBy'] }
        : { orderBy?: ClientGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ClientGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetClientGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Client model
   */
  readonly fields: ClientFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Client.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ClientClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    acces<T extends Client$accesArgs<ExtArgs> = {}>(args?: Subset<T, Client$accesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    messages<T extends Client$messagesArgs<ExtArgs> = {}>(args?: Subset<T, Client$messagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Client model
   */
  interface ClientFieldRefs {
    readonly id: FieldRef<"Client", 'String'>
    readonly nom: FieldRef<"Client", 'String'>
    readonly email: FieldRef<"Client", 'String'>
    readonly telephone: FieldRef<"Client", 'String'>
    readonly societe: FieldRef<"Client", 'String'>
    readonly outil: FieldRef<"Client", 'String'>
    readonly statut: FieldRef<"Client", 'ClientStatut'>
    readonly abonnement: FieldRef<"Client", 'String'>
    readonly trialDebutAt: FieldRef<"Client", 'DateTime'>
    readonly trialFinAt: FieldRef<"Client", 'DateTime'>
    readonly abonnementActif: FieldRef<"Client", 'Boolean'>
    readonly notes: FieldRef<"Client", 'String'>
    readonly createdAt: FieldRef<"Client", 'DateTime'>
    readonly updatedAt: FieldRef<"Client", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Client findUnique
   */
  export type ClientFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * Filter, which Client to fetch.
     */
    where: ClientWhereUniqueInput
  }

  /**
   * Client findUniqueOrThrow
   */
  export type ClientFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * Filter, which Client to fetch.
     */
    where: ClientWhereUniqueInput
  }

  /**
   * Client findFirst
   */
  export type ClientFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * Filter, which Client to fetch.
     */
    where?: ClientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clients to fetch.
     */
    orderBy?: ClientOrderByWithRelationInput | ClientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Clients.
     */
    cursor?: ClientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Clients.
     */
    distinct?: ClientScalarFieldEnum | ClientScalarFieldEnum[]
  }

  /**
   * Client findFirstOrThrow
   */
  export type ClientFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * Filter, which Client to fetch.
     */
    where?: ClientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clients to fetch.
     */
    orderBy?: ClientOrderByWithRelationInput | ClientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Clients.
     */
    cursor?: ClientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Clients.
     */
    distinct?: ClientScalarFieldEnum | ClientScalarFieldEnum[]
  }

  /**
   * Client findMany
   */
  export type ClientFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * Filter, which Clients to fetch.
     */
    where?: ClientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clients to fetch.
     */
    orderBy?: ClientOrderByWithRelationInput | ClientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Clients.
     */
    cursor?: ClientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clients.
     */
    skip?: number
    distinct?: ClientScalarFieldEnum | ClientScalarFieldEnum[]
  }

  /**
   * Client create
   */
  export type ClientCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * The data needed to create a Client.
     */
    data: XOR<ClientCreateInput, ClientUncheckedCreateInput>
  }

  /**
   * Client createMany
   */
  export type ClientCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Clients.
     */
    data: ClientCreateManyInput | ClientCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Client createManyAndReturn
   */
  export type ClientCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * The data used to create many Clients.
     */
    data: ClientCreateManyInput | ClientCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Client update
   */
  export type ClientUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * The data needed to update a Client.
     */
    data: XOR<ClientUpdateInput, ClientUncheckedUpdateInput>
    /**
     * Choose, which Client to update.
     */
    where: ClientWhereUniqueInput
  }

  /**
   * Client updateMany
   */
  export type ClientUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Clients.
     */
    data: XOR<ClientUpdateManyMutationInput, ClientUncheckedUpdateManyInput>
    /**
     * Filter which Clients to update
     */
    where?: ClientWhereInput
    /**
     * Limit how many Clients to update.
     */
    limit?: number
  }

  /**
   * Client updateManyAndReturn
   */
  export type ClientUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * The data used to update Clients.
     */
    data: XOR<ClientUpdateManyMutationInput, ClientUncheckedUpdateManyInput>
    /**
     * Filter which Clients to update
     */
    where?: ClientWhereInput
    /**
     * Limit how many Clients to update.
     */
    limit?: number
  }

  /**
   * Client upsert
   */
  export type ClientUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * The filter to search for the Client to update in case it exists.
     */
    where: ClientWhereUniqueInput
    /**
     * In case the Client found by the `where` argument doesn't exist, create a new Client with this data.
     */
    create: XOR<ClientCreateInput, ClientUncheckedCreateInput>
    /**
     * In case the Client was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ClientUpdateInput, ClientUncheckedUpdateInput>
  }

  /**
   * Client delete
   */
  export type ClientDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * Filter which Client to delete.
     */
    where: ClientWhereUniqueInput
  }

  /**
   * Client deleteMany
   */
  export type ClientDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Clients to delete
     */
    where?: ClientWhereInput
    /**
     * Limit how many Clients to delete.
     */
    limit?: number
  }

  /**
   * Client.acces
   */
  export type Client$accesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Acces
     */
    select?: AccesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Acces
     */
    omit?: AccesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccesInclude<ExtArgs> | null
    where?: AccesWhereInput
    orderBy?: AccesOrderByWithRelationInput | AccesOrderByWithRelationInput[]
    cursor?: AccesWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AccesScalarFieldEnum | AccesScalarFieldEnum[]
  }

  /**
   * Client.messages
   */
  export type Client$messagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    where?: MessageWhereInput
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    cursor?: MessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Client without action
   */
  export type ClientDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
  }


  /**
   * Model Acces
   */

  export type AggregateAcces = {
    _count: AccesCountAggregateOutputType | null
    _min: AccesMinAggregateOutputType | null
    _max: AccesMaxAggregateOutputType | null
  }

  export type AccesMinAggregateOutputType = {
    id: string | null
    clientId: string | null
    email: string | null
    motDePasseTemp: string | null
    actif: boolean | null
    premiereConnexion: boolean | null
    createdAt: Date | null
  }

  export type AccesMaxAggregateOutputType = {
    id: string | null
    clientId: string | null
    email: string | null
    motDePasseTemp: string | null
    actif: boolean | null
    premiereConnexion: boolean | null
    createdAt: Date | null
  }

  export type AccesCountAggregateOutputType = {
    id: number
    clientId: number
    email: number
    motDePasseTemp: number
    actif: number
    premiereConnexion: number
    createdAt: number
    _all: number
  }


  export type AccesMinAggregateInputType = {
    id?: true
    clientId?: true
    email?: true
    motDePasseTemp?: true
    actif?: true
    premiereConnexion?: true
    createdAt?: true
  }

  export type AccesMaxAggregateInputType = {
    id?: true
    clientId?: true
    email?: true
    motDePasseTemp?: true
    actif?: true
    premiereConnexion?: true
    createdAt?: true
  }

  export type AccesCountAggregateInputType = {
    id?: true
    clientId?: true
    email?: true
    motDePasseTemp?: true
    actif?: true
    premiereConnexion?: true
    createdAt?: true
    _all?: true
  }

  export type AccesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Acces to aggregate.
     */
    where?: AccesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Acces to fetch.
     */
    orderBy?: AccesOrderByWithRelationInput | AccesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AccesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Acces from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Acces.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Acces
    **/
    _count?: true | AccesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AccesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AccesMaxAggregateInputType
  }

  export type GetAccesAggregateType<T extends AccesAggregateArgs> = {
        [P in keyof T & keyof AggregateAcces]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAcces[P]>
      : GetScalarType<T[P], AggregateAcces[P]>
  }




  export type AccesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccesWhereInput
    orderBy?: AccesOrderByWithAggregationInput | AccesOrderByWithAggregationInput[]
    by: AccesScalarFieldEnum[] | AccesScalarFieldEnum
    having?: AccesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AccesCountAggregateInputType | true
    _min?: AccesMinAggregateInputType
    _max?: AccesMaxAggregateInputType
  }

  export type AccesGroupByOutputType = {
    id: string
    clientId: string
    email: string
    motDePasseTemp: string | null
    actif: boolean
    premiereConnexion: boolean
    createdAt: Date
    _count: AccesCountAggregateOutputType | null
    _min: AccesMinAggregateOutputType | null
    _max: AccesMaxAggregateOutputType | null
  }

  type GetAccesGroupByPayload<T extends AccesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AccesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AccesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AccesGroupByOutputType[P]>
            : GetScalarType<T[P], AccesGroupByOutputType[P]>
        }
      >
    >


  export type AccesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    clientId?: boolean
    email?: boolean
    motDePasseTemp?: boolean
    actif?: boolean
    premiereConnexion?: boolean
    createdAt?: boolean
    client?: boolean | ClientDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["acces"]>

  export type AccesSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    clientId?: boolean
    email?: boolean
    motDePasseTemp?: boolean
    actif?: boolean
    premiereConnexion?: boolean
    createdAt?: boolean
    client?: boolean | ClientDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["acces"]>

  export type AccesSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    clientId?: boolean
    email?: boolean
    motDePasseTemp?: boolean
    actif?: boolean
    premiereConnexion?: boolean
    createdAt?: boolean
    client?: boolean | ClientDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["acces"]>

  export type AccesSelectScalar = {
    id?: boolean
    clientId?: boolean
    email?: boolean
    motDePasseTemp?: boolean
    actif?: boolean
    premiereConnexion?: boolean
    createdAt?: boolean
  }

  export type AccesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "clientId" | "email" | "motDePasseTemp" | "actif" | "premiereConnexion" | "createdAt", ExtArgs["result"]["acces"]>
  export type AccesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    client?: boolean | ClientDefaultArgs<ExtArgs>
  }
  export type AccesIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    client?: boolean | ClientDefaultArgs<ExtArgs>
  }
  export type AccesIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    client?: boolean | ClientDefaultArgs<ExtArgs>
  }

  export type $AccesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Acces"
    objects: {
      client: Prisma.$ClientPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      clientId: string
      email: string
      motDePasseTemp: string | null
      actif: boolean
      premiereConnexion: boolean
      createdAt: Date
    }, ExtArgs["result"]["acces"]>
    composites: {}
  }

  type AccesGetPayload<S extends boolean | null | undefined | AccesDefaultArgs> = $Result.GetResult<Prisma.$AccesPayload, S>

  type AccesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AccesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AccesCountAggregateInputType | true
    }

  export interface AccesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Acces'], meta: { name: 'Acces' } }
    /**
     * Find zero or one Acces that matches the filter.
     * @param {AccesFindUniqueArgs} args - Arguments to find a Acces
     * @example
     * // Get one Acces
     * const acces = await prisma.acces.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AccesFindUniqueArgs>(args: SelectSubset<T, AccesFindUniqueArgs<ExtArgs>>): Prisma__AccesClient<$Result.GetResult<Prisma.$AccesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Acces that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AccesFindUniqueOrThrowArgs} args - Arguments to find a Acces
     * @example
     * // Get one Acces
     * const acces = await prisma.acces.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AccesFindUniqueOrThrowArgs>(args: SelectSubset<T, AccesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AccesClient<$Result.GetResult<Prisma.$AccesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Acces that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccesFindFirstArgs} args - Arguments to find a Acces
     * @example
     * // Get one Acces
     * const acces = await prisma.acces.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AccesFindFirstArgs>(args?: SelectSubset<T, AccesFindFirstArgs<ExtArgs>>): Prisma__AccesClient<$Result.GetResult<Prisma.$AccesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Acces that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccesFindFirstOrThrowArgs} args - Arguments to find a Acces
     * @example
     * // Get one Acces
     * const acces = await prisma.acces.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AccesFindFirstOrThrowArgs>(args?: SelectSubset<T, AccesFindFirstOrThrowArgs<ExtArgs>>): Prisma__AccesClient<$Result.GetResult<Prisma.$AccesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Acces that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Acces
     * const acces = await prisma.acces.findMany()
     * 
     * // Get first 10 Acces
     * const acces = await prisma.acces.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const accesWithIdOnly = await prisma.acces.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AccesFindManyArgs>(args?: SelectSubset<T, AccesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Acces.
     * @param {AccesCreateArgs} args - Arguments to create a Acces.
     * @example
     * // Create one Acces
     * const Acces = await prisma.acces.create({
     *   data: {
     *     // ... data to create a Acces
     *   }
     * })
     * 
     */
    create<T extends AccesCreateArgs>(args: SelectSubset<T, AccesCreateArgs<ExtArgs>>): Prisma__AccesClient<$Result.GetResult<Prisma.$AccesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Acces.
     * @param {AccesCreateManyArgs} args - Arguments to create many Acces.
     * @example
     * // Create many Acces
     * const acces = await prisma.acces.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AccesCreateManyArgs>(args?: SelectSubset<T, AccesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Acces and returns the data saved in the database.
     * @param {AccesCreateManyAndReturnArgs} args - Arguments to create many Acces.
     * @example
     * // Create many Acces
     * const acces = await prisma.acces.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Acces and only return the `id`
     * const accesWithIdOnly = await prisma.acces.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AccesCreateManyAndReturnArgs>(args?: SelectSubset<T, AccesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Acces.
     * @param {AccesDeleteArgs} args - Arguments to delete one Acces.
     * @example
     * // Delete one Acces
     * const Acces = await prisma.acces.delete({
     *   where: {
     *     // ... filter to delete one Acces
     *   }
     * })
     * 
     */
    delete<T extends AccesDeleteArgs>(args: SelectSubset<T, AccesDeleteArgs<ExtArgs>>): Prisma__AccesClient<$Result.GetResult<Prisma.$AccesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Acces.
     * @param {AccesUpdateArgs} args - Arguments to update one Acces.
     * @example
     * // Update one Acces
     * const acces = await prisma.acces.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AccesUpdateArgs>(args: SelectSubset<T, AccesUpdateArgs<ExtArgs>>): Prisma__AccesClient<$Result.GetResult<Prisma.$AccesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Acces.
     * @param {AccesDeleteManyArgs} args - Arguments to filter Acces to delete.
     * @example
     * // Delete a few Acces
     * const { count } = await prisma.acces.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AccesDeleteManyArgs>(args?: SelectSubset<T, AccesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Acces.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Acces
     * const acces = await prisma.acces.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AccesUpdateManyArgs>(args: SelectSubset<T, AccesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Acces and returns the data updated in the database.
     * @param {AccesUpdateManyAndReturnArgs} args - Arguments to update many Acces.
     * @example
     * // Update many Acces
     * const acces = await prisma.acces.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Acces and only return the `id`
     * const accesWithIdOnly = await prisma.acces.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AccesUpdateManyAndReturnArgs>(args: SelectSubset<T, AccesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Acces.
     * @param {AccesUpsertArgs} args - Arguments to update or create a Acces.
     * @example
     * // Update or create a Acces
     * const acces = await prisma.acces.upsert({
     *   create: {
     *     // ... data to create a Acces
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Acces we want to update
     *   }
     * })
     */
    upsert<T extends AccesUpsertArgs>(args: SelectSubset<T, AccesUpsertArgs<ExtArgs>>): Prisma__AccesClient<$Result.GetResult<Prisma.$AccesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Acces.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccesCountArgs} args - Arguments to filter Acces to count.
     * @example
     * // Count the number of Acces
     * const count = await prisma.acces.count({
     *   where: {
     *     // ... the filter for the Acces we want to count
     *   }
     * })
    **/
    count<T extends AccesCountArgs>(
      args?: Subset<T, AccesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AccesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Acces.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AccesAggregateArgs>(args: Subset<T, AccesAggregateArgs>): Prisma.PrismaPromise<GetAccesAggregateType<T>>

    /**
     * Group by Acces.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AccesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AccesGroupByArgs['orderBy'] }
        : { orderBy?: AccesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AccesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAccesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Acces model
   */
  readonly fields: AccesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Acces.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AccesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    client<T extends ClientDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ClientDefaultArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Acces model
   */
  interface AccesFieldRefs {
    readonly id: FieldRef<"Acces", 'String'>
    readonly clientId: FieldRef<"Acces", 'String'>
    readonly email: FieldRef<"Acces", 'String'>
    readonly motDePasseTemp: FieldRef<"Acces", 'String'>
    readonly actif: FieldRef<"Acces", 'Boolean'>
    readonly premiereConnexion: FieldRef<"Acces", 'Boolean'>
    readonly createdAt: FieldRef<"Acces", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Acces findUnique
   */
  export type AccesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Acces
     */
    select?: AccesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Acces
     */
    omit?: AccesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccesInclude<ExtArgs> | null
    /**
     * Filter, which Acces to fetch.
     */
    where: AccesWhereUniqueInput
  }

  /**
   * Acces findUniqueOrThrow
   */
  export type AccesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Acces
     */
    select?: AccesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Acces
     */
    omit?: AccesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccesInclude<ExtArgs> | null
    /**
     * Filter, which Acces to fetch.
     */
    where: AccesWhereUniqueInput
  }

  /**
   * Acces findFirst
   */
  export type AccesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Acces
     */
    select?: AccesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Acces
     */
    omit?: AccesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccesInclude<ExtArgs> | null
    /**
     * Filter, which Acces to fetch.
     */
    where?: AccesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Acces to fetch.
     */
    orderBy?: AccesOrderByWithRelationInput | AccesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Acces.
     */
    cursor?: AccesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Acces from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Acces.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Acces.
     */
    distinct?: AccesScalarFieldEnum | AccesScalarFieldEnum[]
  }

  /**
   * Acces findFirstOrThrow
   */
  export type AccesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Acces
     */
    select?: AccesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Acces
     */
    omit?: AccesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccesInclude<ExtArgs> | null
    /**
     * Filter, which Acces to fetch.
     */
    where?: AccesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Acces to fetch.
     */
    orderBy?: AccesOrderByWithRelationInput | AccesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Acces.
     */
    cursor?: AccesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Acces from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Acces.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Acces.
     */
    distinct?: AccesScalarFieldEnum | AccesScalarFieldEnum[]
  }

  /**
   * Acces findMany
   */
  export type AccesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Acces
     */
    select?: AccesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Acces
     */
    omit?: AccesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccesInclude<ExtArgs> | null
    /**
     * Filter, which Acces to fetch.
     */
    where?: AccesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Acces to fetch.
     */
    orderBy?: AccesOrderByWithRelationInput | AccesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Acces.
     */
    cursor?: AccesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Acces from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Acces.
     */
    skip?: number
    distinct?: AccesScalarFieldEnum | AccesScalarFieldEnum[]
  }

  /**
   * Acces create
   */
  export type AccesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Acces
     */
    select?: AccesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Acces
     */
    omit?: AccesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccesInclude<ExtArgs> | null
    /**
     * The data needed to create a Acces.
     */
    data: XOR<AccesCreateInput, AccesUncheckedCreateInput>
  }

  /**
   * Acces createMany
   */
  export type AccesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Acces.
     */
    data: AccesCreateManyInput | AccesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Acces createManyAndReturn
   */
  export type AccesCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Acces
     */
    select?: AccesSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Acces
     */
    omit?: AccesOmit<ExtArgs> | null
    /**
     * The data used to create many Acces.
     */
    data: AccesCreateManyInput | AccesCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccesIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Acces update
   */
  export type AccesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Acces
     */
    select?: AccesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Acces
     */
    omit?: AccesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccesInclude<ExtArgs> | null
    /**
     * The data needed to update a Acces.
     */
    data: XOR<AccesUpdateInput, AccesUncheckedUpdateInput>
    /**
     * Choose, which Acces to update.
     */
    where: AccesWhereUniqueInput
  }

  /**
   * Acces updateMany
   */
  export type AccesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Acces.
     */
    data: XOR<AccesUpdateManyMutationInput, AccesUncheckedUpdateManyInput>
    /**
     * Filter which Acces to update
     */
    where?: AccesWhereInput
    /**
     * Limit how many Acces to update.
     */
    limit?: number
  }

  /**
   * Acces updateManyAndReturn
   */
  export type AccesUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Acces
     */
    select?: AccesSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Acces
     */
    omit?: AccesOmit<ExtArgs> | null
    /**
     * The data used to update Acces.
     */
    data: XOR<AccesUpdateManyMutationInput, AccesUncheckedUpdateManyInput>
    /**
     * Filter which Acces to update
     */
    where?: AccesWhereInput
    /**
     * Limit how many Acces to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccesIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Acces upsert
   */
  export type AccesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Acces
     */
    select?: AccesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Acces
     */
    omit?: AccesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccesInclude<ExtArgs> | null
    /**
     * The filter to search for the Acces to update in case it exists.
     */
    where: AccesWhereUniqueInput
    /**
     * In case the Acces found by the `where` argument doesn't exist, create a new Acces with this data.
     */
    create: XOR<AccesCreateInput, AccesUncheckedCreateInput>
    /**
     * In case the Acces was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AccesUpdateInput, AccesUncheckedUpdateInput>
  }

  /**
   * Acces delete
   */
  export type AccesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Acces
     */
    select?: AccesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Acces
     */
    omit?: AccesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccesInclude<ExtArgs> | null
    /**
     * Filter which Acces to delete.
     */
    where: AccesWhereUniqueInput
  }

  /**
   * Acces deleteMany
   */
  export type AccesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Acces to delete
     */
    where?: AccesWhereInput
    /**
     * Limit how many Acces to delete.
     */
    limit?: number
  }

  /**
   * Acces without action
   */
  export type AccesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Acces
     */
    select?: AccesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Acces
     */
    omit?: AccesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccesInclude<ExtArgs> | null
  }


  /**
   * Model Message
   */

  export type AggregateMessage = {
    _count: MessageCountAggregateOutputType | null
    _min: MessageMinAggregateOutputType | null
    _max: MessageMaxAggregateOutputType | null
  }

  export type MessageMinAggregateOutputType = {
    id: string | null
    clientId: string | null
    nom: string | null
    email: string | null
    societe: string | null
    telephone: string | null
    outil: string | null
    message: string | null
    statut: $Enums.MessageStatut | null
    reponse: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MessageMaxAggregateOutputType = {
    id: string | null
    clientId: string | null
    nom: string | null
    email: string | null
    societe: string | null
    telephone: string | null
    outil: string | null
    message: string | null
    statut: $Enums.MessageStatut | null
    reponse: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MessageCountAggregateOutputType = {
    id: number
    clientId: number
    nom: number
    email: number
    societe: number
    telephone: number
    outil: number
    message: number
    statut: number
    reponse: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type MessageMinAggregateInputType = {
    id?: true
    clientId?: true
    nom?: true
    email?: true
    societe?: true
    telephone?: true
    outil?: true
    message?: true
    statut?: true
    reponse?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MessageMaxAggregateInputType = {
    id?: true
    clientId?: true
    nom?: true
    email?: true
    societe?: true
    telephone?: true
    outil?: true
    message?: true
    statut?: true
    reponse?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MessageCountAggregateInputType = {
    id?: true
    clientId?: true
    nom?: true
    email?: true
    societe?: true
    telephone?: true
    outil?: true
    message?: true
    statut?: true
    reponse?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type MessageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Message to aggregate.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Messages
    **/
    _count?: true | MessageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MessageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MessageMaxAggregateInputType
  }

  export type GetMessageAggregateType<T extends MessageAggregateArgs> = {
        [P in keyof T & keyof AggregateMessage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMessage[P]>
      : GetScalarType<T[P], AggregateMessage[P]>
  }




  export type MessageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MessageWhereInput
    orderBy?: MessageOrderByWithAggregationInput | MessageOrderByWithAggregationInput[]
    by: MessageScalarFieldEnum[] | MessageScalarFieldEnum
    having?: MessageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MessageCountAggregateInputType | true
    _min?: MessageMinAggregateInputType
    _max?: MessageMaxAggregateInputType
  }

  export type MessageGroupByOutputType = {
    id: string
    clientId: string | null
    nom: string
    email: string
    societe: string | null
    telephone: string | null
    outil: string
    message: string
    statut: $Enums.MessageStatut
    reponse: string | null
    createdAt: Date
    updatedAt: Date
    _count: MessageCountAggregateOutputType | null
    _min: MessageMinAggregateOutputType | null
    _max: MessageMaxAggregateOutputType | null
  }

  type GetMessageGroupByPayload<T extends MessageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MessageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MessageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MessageGroupByOutputType[P]>
            : GetScalarType<T[P], MessageGroupByOutputType[P]>
        }
      >
    >


  export type MessageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    clientId?: boolean
    nom?: boolean
    email?: boolean
    societe?: boolean
    telephone?: boolean
    outil?: boolean
    message?: boolean
    statut?: boolean
    reponse?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    client?: boolean | Message$clientArgs<ExtArgs>
  }, ExtArgs["result"]["message"]>

  export type MessageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    clientId?: boolean
    nom?: boolean
    email?: boolean
    societe?: boolean
    telephone?: boolean
    outil?: boolean
    message?: boolean
    statut?: boolean
    reponse?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    client?: boolean | Message$clientArgs<ExtArgs>
  }, ExtArgs["result"]["message"]>

  export type MessageSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    clientId?: boolean
    nom?: boolean
    email?: boolean
    societe?: boolean
    telephone?: boolean
    outil?: boolean
    message?: boolean
    statut?: boolean
    reponse?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    client?: boolean | Message$clientArgs<ExtArgs>
  }, ExtArgs["result"]["message"]>

  export type MessageSelectScalar = {
    id?: boolean
    clientId?: boolean
    nom?: boolean
    email?: boolean
    societe?: boolean
    telephone?: boolean
    outil?: boolean
    message?: boolean
    statut?: boolean
    reponse?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type MessageOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "clientId" | "nom" | "email" | "societe" | "telephone" | "outil" | "message" | "statut" | "reponse" | "createdAt" | "updatedAt", ExtArgs["result"]["message"]>
  export type MessageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    client?: boolean | Message$clientArgs<ExtArgs>
  }
  export type MessageIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    client?: boolean | Message$clientArgs<ExtArgs>
  }
  export type MessageIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    client?: boolean | Message$clientArgs<ExtArgs>
  }

  export type $MessagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Message"
    objects: {
      client: Prisma.$ClientPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      clientId: string | null
      nom: string
      email: string
      societe: string | null
      telephone: string | null
      outil: string
      message: string
      statut: $Enums.MessageStatut
      reponse: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["message"]>
    composites: {}
  }

  type MessageGetPayload<S extends boolean | null | undefined | MessageDefaultArgs> = $Result.GetResult<Prisma.$MessagePayload, S>

  type MessageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MessageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MessageCountAggregateInputType | true
    }

  export interface MessageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Message'], meta: { name: 'Message' } }
    /**
     * Find zero or one Message that matches the filter.
     * @param {MessageFindUniqueArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MessageFindUniqueArgs>(args: SelectSubset<T, MessageFindUniqueArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Message that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MessageFindUniqueOrThrowArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MessageFindUniqueOrThrowArgs>(args: SelectSubset<T, MessageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Message that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageFindFirstArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MessageFindFirstArgs>(args?: SelectSubset<T, MessageFindFirstArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Message that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageFindFirstOrThrowArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MessageFindFirstOrThrowArgs>(args?: SelectSubset<T, MessageFindFirstOrThrowArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Messages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Messages
     * const messages = await prisma.message.findMany()
     * 
     * // Get first 10 Messages
     * const messages = await prisma.message.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const messageWithIdOnly = await prisma.message.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MessageFindManyArgs>(args?: SelectSubset<T, MessageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Message.
     * @param {MessageCreateArgs} args - Arguments to create a Message.
     * @example
     * // Create one Message
     * const Message = await prisma.message.create({
     *   data: {
     *     // ... data to create a Message
     *   }
     * })
     * 
     */
    create<T extends MessageCreateArgs>(args: SelectSubset<T, MessageCreateArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Messages.
     * @param {MessageCreateManyArgs} args - Arguments to create many Messages.
     * @example
     * // Create many Messages
     * const message = await prisma.message.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MessageCreateManyArgs>(args?: SelectSubset<T, MessageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Messages and returns the data saved in the database.
     * @param {MessageCreateManyAndReturnArgs} args - Arguments to create many Messages.
     * @example
     * // Create many Messages
     * const message = await prisma.message.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Messages and only return the `id`
     * const messageWithIdOnly = await prisma.message.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MessageCreateManyAndReturnArgs>(args?: SelectSubset<T, MessageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Message.
     * @param {MessageDeleteArgs} args - Arguments to delete one Message.
     * @example
     * // Delete one Message
     * const Message = await prisma.message.delete({
     *   where: {
     *     // ... filter to delete one Message
     *   }
     * })
     * 
     */
    delete<T extends MessageDeleteArgs>(args: SelectSubset<T, MessageDeleteArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Message.
     * @param {MessageUpdateArgs} args - Arguments to update one Message.
     * @example
     * // Update one Message
     * const message = await prisma.message.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MessageUpdateArgs>(args: SelectSubset<T, MessageUpdateArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Messages.
     * @param {MessageDeleteManyArgs} args - Arguments to filter Messages to delete.
     * @example
     * // Delete a few Messages
     * const { count } = await prisma.message.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MessageDeleteManyArgs>(args?: SelectSubset<T, MessageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Messages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Messages
     * const message = await prisma.message.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MessageUpdateManyArgs>(args: SelectSubset<T, MessageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Messages and returns the data updated in the database.
     * @param {MessageUpdateManyAndReturnArgs} args - Arguments to update many Messages.
     * @example
     * // Update many Messages
     * const message = await prisma.message.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Messages and only return the `id`
     * const messageWithIdOnly = await prisma.message.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MessageUpdateManyAndReturnArgs>(args: SelectSubset<T, MessageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Message.
     * @param {MessageUpsertArgs} args - Arguments to update or create a Message.
     * @example
     * // Update or create a Message
     * const message = await prisma.message.upsert({
     *   create: {
     *     // ... data to create a Message
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Message we want to update
     *   }
     * })
     */
    upsert<T extends MessageUpsertArgs>(args: SelectSubset<T, MessageUpsertArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Messages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageCountArgs} args - Arguments to filter Messages to count.
     * @example
     * // Count the number of Messages
     * const count = await prisma.message.count({
     *   where: {
     *     // ... the filter for the Messages we want to count
     *   }
     * })
    **/
    count<T extends MessageCountArgs>(
      args?: Subset<T, MessageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MessageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Message.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MessageAggregateArgs>(args: Subset<T, MessageAggregateArgs>): Prisma.PrismaPromise<GetMessageAggregateType<T>>

    /**
     * Group by Message.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MessageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MessageGroupByArgs['orderBy'] }
        : { orderBy?: MessageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MessageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMessageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Message model
   */
  readonly fields: MessageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Message.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MessageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    client<T extends Message$clientArgs<ExtArgs> = {}>(args?: Subset<T, Message$clientArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Message model
   */
  interface MessageFieldRefs {
    readonly id: FieldRef<"Message", 'String'>
    readonly clientId: FieldRef<"Message", 'String'>
    readonly nom: FieldRef<"Message", 'String'>
    readonly email: FieldRef<"Message", 'String'>
    readonly societe: FieldRef<"Message", 'String'>
    readonly telephone: FieldRef<"Message", 'String'>
    readonly outil: FieldRef<"Message", 'String'>
    readonly message: FieldRef<"Message", 'String'>
    readonly statut: FieldRef<"Message", 'MessageStatut'>
    readonly reponse: FieldRef<"Message", 'String'>
    readonly createdAt: FieldRef<"Message", 'DateTime'>
    readonly updatedAt: FieldRef<"Message", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Message findUnique
   */
  export type MessageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message findUniqueOrThrow
   */
  export type MessageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message findFirst
   */
  export type MessageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Messages.
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Messages.
     */
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Message findFirstOrThrow
   */
  export type MessageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Messages.
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Messages.
     */
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Message findMany
   */
  export type MessageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Messages to fetch.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Messages.
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Message create
   */
  export type MessageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * The data needed to create a Message.
     */
    data: XOR<MessageCreateInput, MessageUncheckedCreateInput>
  }

  /**
   * Message createMany
   */
  export type MessageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Messages.
     */
    data: MessageCreateManyInput | MessageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Message createManyAndReturn
   */
  export type MessageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * The data used to create many Messages.
     */
    data: MessageCreateManyInput | MessageCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Message update
   */
  export type MessageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * The data needed to update a Message.
     */
    data: XOR<MessageUpdateInput, MessageUncheckedUpdateInput>
    /**
     * Choose, which Message to update.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message updateMany
   */
  export type MessageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Messages.
     */
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyInput>
    /**
     * Filter which Messages to update
     */
    where?: MessageWhereInput
    /**
     * Limit how many Messages to update.
     */
    limit?: number
  }

  /**
   * Message updateManyAndReturn
   */
  export type MessageUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * The data used to update Messages.
     */
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyInput>
    /**
     * Filter which Messages to update
     */
    where?: MessageWhereInput
    /**
     * Limit how many Messages to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Message upsert
   */
  export type MessageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * The filter to search for the Message to update in case it exists.
     */
    where: MessageWhereUniqueInput
    /**
     * In case the Message found by the `where` argument doesn't exist, create a new Message with this data.
     */
    create: XOR<MessageCreateInput, MessageUncheckedCreateInput>
    /**
     * In case the Message was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MessageUpdateInput, MessageUncheckedUpdateInput>
  }

  /**
   * Message delete
   */
  export type MessageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter which Message to delete.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message deleteMany
   */
  export type MessageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Messages to delete
     */
    where?: MessageWhereInput
    /**
     * Limit how many Messages to delete.
     */
    limit?: number
  }

  /**
   * Message.client
   */
  export type Message$clientArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    where?: ClientWhereInput
  }

  /**
   * Message without action
   */
  export type MessageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
  }


  /**
   * Model AuditLog
   */

  export type AggregateAuditLog = {
    _count: AuditLogCountAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  export type AuditLogMinAggregateOutputType = {
    id: string | null
    outil: string | null
    cibleType: string | null
    cibleId: string | null
    action: string | null
    statut: string | null
    acteurId: string | null
    acteurEmail: string | null
    resume: string | null
    erreur: string | null
    createdAt: Date | null
  }

  export type AuditLogMaxAggregateOutputType = {
    id: string | null
    outil: string | null
    cibleType: string | null
    cibleId: string | null
    action: string | null
    statut: string | null
    acteurId: string | null
    acteurEmail: string | null
    resume: string | null
    erreur: string | null
    createdAt: Date | null
  }

  export type AuditLogCountAggregateOutputType = {
    id: number
    outil: number
    cibleType: number
    cibleId: number
    action: number
    statut: number
    acteurId: number
    acteurEmail: number
    resume: number
    avant: number
    apres: number
    erreur: number
    createdAt: number
    _all: number
  }


  export type AuditLogMinAggregateInputType = {
    id?: true
    outil?: true
    cibleType?: true
    cibleId?: true
    action?: true
    statut?: true
    acteurId?: true
    acteurEmail?: true
    resume?: true
    erreur?: true
    createdAt?: true
  }

  export type AuditLogMaxAggregateInputType = {
    id?: true
    outil?: true
    cibleType?: true
    cibleId?: true
    action?: true
    statut?: true
    acteurId?: true
    acteurEmail?: true
    resume?: true
    erreur?: true
    createdAt?: true
  }

  export type AuditLogCountAggregateInputType = {
    id?: true
    outil?: true
    cibleType?: true
    cibleId?: true
    action?: true
    statut?: true
    acteurId?: true
    acteurEmail?: true
    resume?: true
    avant?: true
    apres?: true
    erreur?: true
    createdAt?: true
    _all?: true
  }

  export type AuditLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLog to aggregate.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AuditLogs
    **/
    _count?: true | AuditLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuditLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuditLogMaxAggregateInputType
  }

  export type GetAuditLogAggregateType<T extends AuditLogAggregateArgs> = {
        [P in keyof T & keyof AggregateAuditLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuditLog[P]>
      : GetScalarType<T[P], AggregateAuditLog[P]>
  }




  export type AuditLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogWhereInput
    orderBy?: AuditLogOrderByWithAggregationInput | AuditLogOrderByWithAggregationInput[]
    by: AuditLogScalarFieldEnum[] | AuditLogScalarFieldEnum
    having?: AuditLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuditLogCountAggregateInputType | true
    _min?: AuditLogMinAggregateInputType
    _max?: AuditLogMaxAggregateInputType
  }

  export type AuditLogGroupByOutputType = {
    id: string
    outil: string
    cibleType: string
    cibleId: string | null
    action: string
    statut: string
    acteurId: string | null
    acteurEmail: string | null
    resume: string | null
    avant: JsonValue | null
    apres: JsonValue | null
    erreur: string | null
    createdAt: Date
    _count: AuditLogCountAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  type GetAuditLogGroupByPayload<T extends AuditLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuditLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuditLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
            : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
        }
      >
    >


  export type AuditLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    outil?: boolean
    cibleType?: boolean
    cibleId?: boolean
    action?: boolean
    statut?: boolean
    acteurId?: boolean
    acteurEmail?: boolean
    resume?: boolean
    avant?: boolean
    apres?: boolean
    erreur?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    outil?: boolean
    cibleType?: boolean
    cibleId?: boolean
    action?: boolean
    statut?: boolean
    acteurId?: boolean
    acteurEmail?: boolean
    resume?: boolean
    avant?: boolean
    apres?: boolean
    erreur?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    outil?: boolean
    cibleType?: boolean
    cibleId?: boolean
    action?: boolean
    statut?: boolean
    acteurId?: boolean
    acteurEmail?: boolean
    resume?: boolean
    avant?: boolean
    apres?: boolean
    erreur?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectScalar = {
    id?: boolean
    outil?: boolean
    cibleType?: boolean
    cibleId?: boolean
    action?: boolean
    statut?: boolean
    acteurId?: boolean
    acteurEmail?: boolean
    resume?: boolean
    avant?: boolean
    apres?: boolean
    erreur?: boolean
    createdAt?: boolean
  }

  export type AuditLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "outil" | "cibleType" | "cibleId" | "action" | "statut" | "acteurId" | "acteurEmail" | "resume" | "avant" | "apres" | "erreur" | "createdAt", ExtArgs["result"]["auditLog"]>

  export type $AuditLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AuditLog"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      outil: string
      cibleType: string
      cibleId: string | null
      action: string
      statut: string
      acteurId: string | null
      acteurEmail: string | null
      resume: string | null
      avant: Prisma.JsonValue | null
      apres: Prisma.JsonValue | null
      erreur: string | null
      createdAt: Date
    }, ExtArgs["result"]["auditLog"]>
    composites: {}
  }

  type AuditLogGetPayload<S extends boolean | null | undefined | AuditLogDefaultArgs> = $Result.GetResult<Prisma.$AuditLogPayload, S>

  type AuditLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AuditLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AuditLogCountAggregateInputType | true
    }

  export interface AuditLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AuditLog'], meta: { name: 'AuditLog' } }
    /**
     * Find zero or one AuditLog that matches the filter.
     * @param {AuditLogFindUniqueArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuditLogFindUniqueArgs>(args: SelectSubset<T, AuditLogFindUniqueArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AuditLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AuditLogFindUniqueOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuditLogFindUniqueOrThrowArgs>(args: SelectSubset<T, AuditLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuditLogFindFirstArgs>(args?: SelectSubset<T, AuditLogFindFirstArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuditLogFindFirstOrThrowArgs>(args?: SelectSubset<T, AuditLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AuditLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AuditLogs
     * const auditLogs = await prisma.auditLog.findMany()
     * 
     * // Get first 10 AuditLogs
     * const auditLogs = await prisma.auditLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AuditLogFindManyArgs>(args?: SelectSubset<T, AuditLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AuditLog.
     * @param {AuditLogCreateArgs} args - Arguments to create a AuditLog.
     * @example
     * // Create one AuditLog
     * const AuditLog = await prisma.auditLog.create({
     *   data: {
     *     // ... data to create a AuditLog
     *   }
     * })
     * 
     */
    create<T extends AuditLogCreateArgs>(args: SelectSubset<T, AuditLogCreateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AuditLogs.
     * @param {AuditLogCreateManyArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuditLogCreateManyArgs>(args?: SelectSubset<T, AuditLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AuditLogs and returns the data saved in the database.
     * @param {AuditLogCreateManyAndReturnArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AuditLogs and only return the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AuditLogCreateManyAndReturnArgs>(args?: SelectSubset<T, AuditLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AuditLog.
     * @param {AuditLogDeleteArgs} args - Arguments to delete one AuditLog.
     * @example
     * // Delete one AuditLog
     * const AuditLog = await prisma.auditLog.delete({
     *   where: {
     *     // ... filter to delete one AuditLog
     *   }
     * })
     * 
     */
    delete<T extends AuditLogDeleteArgs>(args: SelectSubset<T, AuditLogDeleteArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AuditLog.
     * @param {AuditLogUpdateArgs} args - Arguments to update one AuditLog.
     * @example
     * // Update one AuditLog
     * const auditLog = await prisma.auditLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuditLogUpdateArgs>(args: SelectSubset<T, AuditLogUpdateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AuditLogs.
     * @param {AuditLogDeleteManyArgs} args - Arguments to filter AuditLogs to delete.
     * @example
     * // Delete a few AuditLogs
     * const { count } = await prisma.auditLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuditLogDeleteManyArgs>(args?: SelectSubset<T, AuditLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AuditLogs
     * const auditLog = await prisma.auditLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuditLogUpdateManyArgs>(args: SelectSubset<T, AuditLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditLogs and returns the data updated in the database.
     * @param {AuditLogUpdateManyAndReturnArgs} args - Arguments to update many AuditLogs.
     * @example
     * // Update many AuditLogs
     * const auditLog = await prisma.auditLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AuditLogs and only return the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AuditLogUpdateManyAndReturnArgs>(args: SelectSubset<T, AuditLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AuditLog.
     * @param {AuditLogUpsertArgs} args - Arguments to update or create a AuditLog.
     * @example
     * // Update or create a AuditLog
     * const auditLog = await prisma.auditLog.upsert({
     *   create: {
     *     // ... data to create a AuditLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AuditLog we want to update
     *   }
     * })
     */
    upsert<T extends AuditLogUpsertArgs>(args: SelectSubset<T, AuditLogUpsertArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogCountArgs} args - Arguments to filter AuditLogs to count.
     * @example
     * // Count the number of AuditLogs
     * const count = await prisma.auditLog.count({
     *   where: {
     *     // ... the filter for the AuditLogs we want to count
     *   }
     * })
    **/
    count<T extends AuditLogCountArgs>(
      args?: Subset<T, AuditLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuditLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AuditLogAggregateArgs>(args: Subset<T, AuditLogAggregateArgs>): Prisma.PrismaPromise<GetAuditLogAggregateType<T>>

    /**
     * Group by AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AuditLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuditLogGroupByArgs['orderBy'] }
        : { orderBy?: AuditLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AuditLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuditLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AuditLog model
   */
  readonly fields: AuditLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AuditLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuditLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AuditLog model
   */
  interface AuditLogFieldRefs {
    readonly id: FieldRef<"AuditLog", 'String'>
    readonly outil: FieldRef<"AuditLog", 'String'>
    readonly cibleType: FieldRef<"AuditLog", 'String'>
    readonly cibleId: FieldRef<"AuditLog", 'String'>
    readonly action: FieldRef<"AuditLog", 'String'>
    readonly statut: FieldRef<"AuditLog", 'String'>
    readonly acteurId: FieldRef<"AuditLog", 'String'>
    readonly acteurEmail: FieldRef<"AuditLog", 'String'>
    readonly resume: FieldRef<"AuditLog", 'String'>
    readonly avant: FieldRef<"AuditLog", 'Json'>
    readonly apres: FieldRef<"AuditLog", 'Json'>
    readonly erreur: FieldRef<"AuditLog", 'String'>
    readonly createdAt: FieldRef<"AuditLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AuditLog findUnique
   */
  export type AuditLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findUniqueOrThrow
   */
  export type AuditLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findFirst
   */
  export type AuditLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findFirstOrThrow
   */
  export type AuditLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findMany
   */
  export type AuditLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter, which AuditLogs to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog create
   */
  export type AuditLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data needed to create a AuditLog.
     */
    data: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
  }

  /**
   * AuditLog createMany
   */
  export type AuditLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuditLog createManyAndReturn
   */
  export type AuditLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuditLog update
   */
  export type AuditLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data needed to update a AuditLog.
     */
    data: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
    /**
     * Choose, which AuditLog to update.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog updateMany
   */
  export type AuditLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AuditLogs.
     */
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AuditLogs to update
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to update.
     */
    limit?: number
  }

  /**
   * AuditLog updateManyAndReturn
   */
  export type AuditLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data used to update AuditLogs.
     */
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AuditLogs to update
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to update.
     */
    limit?: number
  }

  /**
   * AuditLog upsert
   */
  export type AuditLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The filter to search for the AuditLog to update in case it exists.
     */
    where: AuditLogWhereUniqueInput
    /**
     * In case the AuditLog found by the `where` argument doesn't exist, create a new AuditLog with this data.
     */
    create: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
    /**
     * In case the AuditLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
  }

  /**
   * AuditLog delete
   */
  export type AuditLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter which AuditLog to delete.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog deleteMany
   */
  export type AuditLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLogs to delete
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to delete.
     */
    limit?: number
  }

  /**
   * AuditLog without action
   */
  export type AuditLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
  }


  /**
   * Model ErrorReport
   */

  export type AggregateErrorReport = {
    _count: ErrorReportCountAggregateOutputType | null
    _min: ErrorReportMinAggregateOutputType | null
    _max: ErrorReportMaxAggregateOutputType | null
  }

  export type ErrorReportMinAggregateOutputType = {
    id: string | null
    outil: string | null
    niveau: string | null
    message: string | null
    stack: string | null
    url: string | null
    userAgent: string | null
    statut: string | null
    notes: string | null
    resolution: string | null
    resolvedAt: Date | null
    resolvedBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ErrorReportMaxAggregateOutputType = {
    id: string | null
    outil: string | null
    niveau: string | null
    message: string | null
    stack: string | null
    url: string | null
    userAgent: string | null
    statut: string | null
    notes: string | null
    resolution: string | null
    resolvedAt: Date | null
    resolvedBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ErrorReportCountAggregateOutputType = {
    id: number
    outil: number
    niveau: number
    message: number
    stack: number
    url: number
    userAgent: number
    contexte: number
    statut: number
    notes: number
    resolution: number
    resolvedAt: number
    resolvedBy: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ErrorReportMinAggregateInputType = {
    id?: true
    outil?: true
    niveau?: true
    message?: true
    stack?: true
    url?: true
    userAgent?: true
    statut?: true
    notes?: true
    resolution?: true
    resolvedAt?: true
    resolvedBy?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ErrorReportMaxAggregateInputType = {
    id?: true
    outil?: true
    niveau?: true
    message?: true
    stack?: true
    url?: true
    userAgent?: true
    statut?: true
    notes?: true
    resolution?: true
    resolvedAt?: true
    resolvedBy?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ErrorReportCountAggregateInputType = {
    id?: true
    outil?: true
    niveau?: true
    message?: true
    stack?: true
    url?: true
    userAgent?: true
    contexte?: true
    statut?: true
    notes?: true
    resolution?: true
    resolvedAt?: true
    resolvedBy?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ErrorReportAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ErrorReport to aggregate.
     */
    where?: ErrorReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ErrorReports to fetch.
     */
    orderBy?: ErrorReportOrderByWithRelationInput | ErrorReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ErrorReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ErrorReports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ErrorReports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ErrorReports
    **/
    _count?: true | ErrorReportCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ErrorReportMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ErrorReportMaxAggregateInputType
  }

  export type GetErrorReportAggregateType<T extends ErrorReportAggregateArgs> = {
        [P in keyof T & keyof AggregateErrorReport]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateErrorReport[P]>
      : GetScalarType<T[P], AggregateErrorReport[P]>
  }




  export type ErrorReportGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ErrorReportWhereInput
    orderBy?: ErrorReportOrderByWithAggregationInput | ErrorReportOrderByWithAggregationInput[]
    by: ErrorReportScalarFieldEnum[] | ErrorReportScalarFieldEnum
    having?: ErrorReportScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ErrorReportCountAggregateInputType | true
    _min?: ErrorReportMinAggregateInputType
    _max?: ErrorReportMaxAggregateInputType
  }

  export type ErrorReportGroupByOutputType = {
    id: string
    outil: string
    niveau: string
    message: string
    stack: string | null
    url: string | null
    userAgent: string | null
    contexte: JsonValue | null
    statut: string
    notes: string | null
    resolution: string | null
    resolvedAt: Date | null
    resolvedBy: string | null
    createdAt: Date
    updatedAt: Date
    _count: ErrorReportCountAggregateOutputType | null
    _min: ErrorReportMinAggregateOutputType | null
    _max: ErrorReportMaxAggregateOutputType | null
  }

  type GetErrorReportGroupByPayload<T extends ErrorReportGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ErrorReportGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ErrorReportGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ErrorReportGroupByOutputType[P]>
            : GetScalarType<T[P], ErrorReportGroupByOutputType[P]>
        }
      >
    >


  export type ErrorReportSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    outil?: boolean
    niveau?: boolean
    message?: boolean
    stack?: boolean
    url?: boolean
    userAgent?: boolean
    contexte?: boolean
    statut?: boolean
    notes?: boolean
    resolution?: boolean
    resolvedAt?: boolean
    resolvedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["errorReport"]>

  export type ErrorReportSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    outil?: boolean
    niveau?: boolean
    message?: boolean
    stack?: boolean
    url?: boolean
    userAgent?: boolean
    contexte?: boolean
    statut?: boolean
    notes?: boolean
    resolution?: boolean
    resolvedAt?: boolean
    resolvedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["errorReport"]>

  export type ErrorReportSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    outil?: boolean
    niveau?: boolean
    message?: boolean
    stack?: boolean
    url?: boolean
    userAgent?: boolean
    contexte?: boolean
    statut?: boolean
    notes?: boolean
    resolution?: boolean
    resolvedAt?: boolean
    resolvedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["errorReport"]>

  export type ErrorReportSelectScalar = {
    id?: boolean
    outil?: boolean
    niveau?: boolean
    message?: boolean
    stack?: boolean
    url?: boolean
    userAgent?: boolean
    contexte?: boolean
    statut?: boolean
    notes?: boolean
    resolution?: boolean
    resolvedAt?: boolean
    resolvedBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ErrorReportOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "outil" | "niveau" | "message" | "stack" | "url" | "userAgent" | "contexte" | "statut" | "notes" | "resolution" | "resolvedAt" | "resolvedBy" | "createdAt" | "updatedAt", ExtArgs["result"]["errorReport"]>

  export type $ErrorReportPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ErrorReport"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      outil: string
      niveau: string
      message: string
      stack: string | null
      url: string | null
      userAgent: string | null
      contexte: Prisma.JsonValue | null
      statut: string
      notes: string | null
      resolution: string | null
      resolvedAt: Date | null
      resolvedBy: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["errorReport"]>
    composites: {}
  }

  type ErrorReportGetPayload<S extends boolean | null | undefined | ErrorReportDefaultArgs> = $Result.GetResult<Prisma.$ErrorReportPayload, S>

  type ErrorReportCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ErrorReportFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ErrorReportCountAggregateInputType | true
    }

  export interface ErrorReportDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ErrorReport'], meta: { name: 'ErrorReport' } }
    /**
     * Find zero or one ErrorReport that matches the filter.
     * @param {ErrorReportFindUniqueArgs} args - Arguments to find a ErrorReport
     * @example
     * // Get one ErrorReport
     * const errorReport = await prisma.errorReport.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ErrorReportFindUniqueArgs>(args: SelectSubset<T, ErrorReportFindUniqueArgs<ExtArgs>>): Prisma__ErrorReportClient<$Result.GetResult<Prisma.$ErrorReportPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ErrorReport that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ErrorReportFindUniqueOrThrowArgs} args - Arguments to find a ErrorReport
     * @example
     * // Get one ErrorReport
     * const errorReport = await prisma.errorReport.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ErrorReportFindUniqueOrThrowArgs>(args: SelectSubset<T, ErrorReportFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ErrorReportClient<$Result.GetResult<Prisma.$ErrorReportPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ErrorReport that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ErrorReportFindFirstArgs} args - Arguments to find a ErrorReport
     * @example
     * // Get one ErrorReport
     * const errorReport = await prisma.errorReport.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ErrorReportFindFirstArgs>(args?: SelectSubset<T, ErrorReportFindFirstArgs<ExtArgs>>): Prisma__ErrorReportClient<$Result.GetResult<Prisma.$ErrorReportPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ErrorReport that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ErrorReportFindFirstOrThrowArgs} args - Arguments to find a ErrorReport
     * @example
     * // Get one ErrorReport
     * const errorReport = await prisma.errorReport.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ErrorReportFindFirstOrThrowArgs>(args?: SelectSubset<T, ErrorReportFindFirstOrThrowArgs<ExtArgs>>): Prisma__ErrorReportClient<$Result.GetResult<Prisma.$ErrorReportPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ErrorReports that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ErrorReportFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ErrorReports
     * const errorReports = await prisma.errorReport.findMany()
     * 
     * // Get first 10 ErrorReports
     * const errorReports = await prisma.errorReport.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const errorReportWithIdOnly = await prisma.errorReport.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ErrorReportFindManyArgs>(args?: SelectSubset<T, ErrorReportFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ErrorReportPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ErrorReport.
     * @param {ErrorReportCreateArgs} args - Arguments to create a ErrorReport.
     * @example
     * // Create one ErrorReport
     * const ErrorReport = await prisma.errorReport.create({
     *   data: {
     *     // ... data to create a ErrorReport
     *   }
     * })
     * 
     */
    create<T extends ErrorReportCreateArgs>(args: SelectSubset<T, ErrorReportCreateArgs<ExtArgs>>): Prisma__ErrorReportClient<$Result.GetResult<Prisma.$ErrorReportPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ErrorReports.
     * @param {ErrorReportCreateManyArgs} args - Arguments to create many ErrorReports.
     * @example
     * // Create many ErrorReports
     * const errorReport = await prisma.errorReport.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ErrorReportCreateManyArgs>(args?: SelectSubset<T, ErrorReportCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ErrorReports and returns the data saved in the database.
     * @param {ErrorReportCreateManyAndReturnArgs} args - Arguments to create many ErrorReports.
     * @example
     * // Create many ErrorReports
     * const errorReport = await prisma.errorReport.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ErrorReports and only return the `id`
     * const errorReportWithIdOnly = await prisma.errorReport.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ErrorReportCreateManyAndReturnArgs>(args?: SelectSubset<T, ErrorReportCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ErrorReportPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ErrorReport.
     * @param {ErrorReportDeleteArgs} args - Arguments to delete one ErrorReport.
     * @example
     * // Delete one ErrorReport
     * const ErrorReport = await prisma.errorReport.delete({
     *   where: {
     *     // ... filter to delete one ErrorReport
     *   }
     * })
     * 
     */
    delete<T extends ErrorReportDeleteArgs>(args: SelectSubset<T, ErrorReportDeleteArgs<ExtArgs>>): Prisma__ErrorReportClient<$Result.GetResult<Prisma.$ErrorReportPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ErrorReport.
     * @param {ErrorReportUpdateArgs} args - Arguments to update one ErrorReport.
     * @example
     * // Update one ErrorReport
     * const errorReport = await prisma.errorReport.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ErrorReportUpdateArgs>(args: SelectSubset<T, ErrorReportUpdateArgs<ExtArgs>>): Prisma__ErrorReportClient<$Result.GetResult<Prisma.$ErrorReportPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ErrorReports.
     * @param {ErrorReportDeleteManyArgs} args - Arguments to filter ErrorReports to delete.
     * @example
     * // Delete a few ErrorReports
     * const { count } = await prisma.errorReport.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ErrorReportDeleteManyArgs>(args?: SelectSubset<T, ErrorReportDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ErrorReports.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ErrorReportUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ErrorReports
     * const errorReport = await prisma.errorReport.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ErrorReportUpdateManyArgs>(args: SelectSubset<T, ErrorReportUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ErrorReports and returns the data updated in the database.
     * @param {ErrorReportUpdateManyAndReturnArgs} args - Arguments to update many ErrorReports.
     * @example
     * // Update many ErrorReports
     * const errorReport = await prisma.errorReport.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ErrorReports and only return the `id`
     * const errorReportWithIdOnly = await prisma.errorReport.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ErrorReportUpdateManyAndReturnArgs>(args: SelectSubset<T, ErrorReportUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ErrorReportPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ErrorReport.
     * @param {ErrorReportUpsertArgs} args - Arguments to update or create a ErrorReport.
     * @example
     * // Update or create a ErrorReport
     * const errorReport = await prisma.errorReport.upsert({
     *   create: {
     *     // ... data to create a ErrorReport
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ErrorReport we want to update
     *   }
     * })
     */
    upsert<T extends ErrorReportUpsertArgs>(args: SelectSubset<T, ErrorReportUpsertArgs<ExtArgs>>): Prisma__ErrorReportClient<$Result.GetResult<Prisma.$ErrorReportPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ErrorReports.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ErrorReportCountArgs} args - Arguments to filter ErrorReports to count.
     * @example
     * // Count the number of ErrorReports
     * const count = await prisma.errorReport.count({
     *   where: {
     *     // ... the filter for the ErrorReports we want to count
     *   }
     * })
    **/
    count<T extends ErrorReportCountArgs>(
      args?: Subset<T, ErrorReportCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ErrorReportCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ErrorReport.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ErrorReportAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ErrorReportAggregateArgs>(args: Subset<T, ErrorReportAggregateArgs>): Prisma.PrismaPromise<GetErrorReportAggregateType<T>>

    /**
     * Group by ErrorReport.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ErrorReportGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ErrorReportGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ErrorReportGroupByArgs['orderBy'] }
        : { orderBy?: ErrorReportGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ErrorReportGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetErrorReportGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ErrorReport model
   */
  readonly fields: ErrorReportFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ErrorReport.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ErrorReportClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ErrorReport model
   */
  interface ErrorReportFieldRefs {
    readonly id: FieldRef<"ErrorReport", 'String'>
    readonly outil: FieldRef<"ErrorReport", 'String'>
    readonly niveau: FieldRef<"ErrorReport", 'String'>
    readonly message: FieldRef<"ErrorReport", 'String'>
    readonly stack: FieldRef<"ErrorReport", 'String'>
    readonly url: FieldRef<"ErrorReport", 'String'>
    readonly userAgent: FieldRef<"ErrorReport", 'String'>
    readonly contexte: FieldRef<"ErrorReport", 'Json'>
    readonly statut: FieldRef<"ErrorReport", 'String'>
    readonly notes: FieldRef<"ErrorReport", 'String'>
    readonly resolution: FieldRef<"ErrorReport", 'String'>
    readonly resolvedAt: FieldRef<"ErrorReport", 'DateTime'>
    readonly resolvedBy: FieldRef<"ErrorReport", 'String'>
    readonly createdAt: FieldRef<"ErrorReport", 'DateTime'>
    readonly updatedAt: FieldRef<"ErrorReport", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ErrorReport findUnique
   */
  export type ErrorReportFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ErrorReport
     */
    select?: ErrorReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ErrorReport
     */
    omit?: ErrorReportOmit<ExtArgs> | null
    /**
     * Filter, which ErrorReport to fetch.
     */
    where: ErrorReportWhereUniqueInput
  }

  /**
   * ErrorReport findUniqueOrThrow
   */
  export type ErrorReportFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ErrorReport
     */
    select?: ErrorReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ErrorReport
     */
    omit?: ErrorReportOmit<ExtArgs> | null
    /**
     * Filter, which ErrorReport to fetch.
     */
    where: ErrorReportWhereUniqueInput
  }

  /**
   * ErrorReport findFirst
   */
  export type ErrorReportFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ErrorReport
     */
    select?: ErrorReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ErrorReport
     */
    omit?: ErrorReportOmit<ExtArgs> | null
    /**
     * Filter, which ErrorReport to fetch.
     */
    where?: ErrorReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ErrorReports to fetch.
     */
    orderBy?: ErrorReportOrderByWithRelationInput | ErrorReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ErrorReports.
     */
    cursor?: ErrorReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ErrorReports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ErrorReports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ErrorReports.
     */
    distinct?: ErrorReportScalarFieldEnum | ErrorReportScalarFieldEnum[]
  }

  /**
   * ErrorReport findFirstOrThrow
   */
  export type ErrorReportFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ErrorReport
     */
    select?: ErrorReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ErrorReport
     */
    omit?: ErrorReportOmit<ExtArgs> | null
    /**
     * Filter, which ErrorReport to fetch.
     */
    where?: ErrorReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ErrorReports to fetch.
     */
    orderBy?: ErrorReportOrderByWithRelationInput | ErrorReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ErrorReports.
     */
    cursor?: ErrorReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ErrorReports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ErrorReports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ErrorReports.
     */
    distinct?: ErrorReportScalarFieldEnum | ErrorReportScalarFieldEnum[]
  }

  /**
   * ErrorReport findMany
   */
  export type ErrorReportFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ErrorReport
     */
    select?: ErrorReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ErrorReport
     */
    omit?: ErrorReportOmit<ExtArgs> | null
    /**
     * Filter, which ErrorReports to fetch.
     */
    where?: ErrorReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ErrorReports to fetch.
     */
    orderBy?: ErrorReportOrderByWithRelationInput | ErrorReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ErrorReports.
     */
    cursor?: ErrorReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ErrorReports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ErrorReports.
     */
    skip?: number
    distinct?: ErrorReportScalarFieldEnum | ErrorReportScalarFieldEnum[]
  }

  /**
   * ErrorReport create
   */
  export type ErrorReportCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ErrorReport
     */
    select?: ErrorReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ErrorReport
     */
    omit?: ErrorReportOmit<ExtArgs> | null
    /**
     * The data needed to create a ErrorReport.
     */
    data: XOR<ErrorReportCreateInput, ErrorReportUncheckedCreateInput>
  }

  /**
   * ErrorReport createMany
   */
  export type ErrorReportCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ErrorReports.
     */
    data: ErrorReportCreateManyInput | ErrorReportCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ErrorReport createManyAndReturn
   */
  export type ErrorReportCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ErrorReport
     */
    select?: ErrorReportSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ErrorReport
     */
    omit?: ErrorReportOmit<ExtArgs> | null
    /**
     * The data used to create many ErrorReports.
     */
    data: ErrorReportCreateManyInput | ErrorReportCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ErrorReport update
   */
  export type ErrorReportUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ErrorReport
     */
    select?: ErrorReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ErrorReport
     */
    omit?: ErrorReportOmit<ExtArgs> | null
    /**
     * The data needed to update a ErrorReport.
     */
    data: XOR<ErrorReportUpdateInput, ErrorReportUncheckedUpdateInput>
    /**
     * Choose, which ErrorReport to update.
     */
    where: ErrorReportWhereUniqueInput
  }

  /**
   * ErrorReport updateMany
   */
  export type ErrorReportUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ErrorReports.
     */
    data: XOR<ErrorReportUpdateManyMutationInput, ErrorReportUncheckedUpdateManyInput>
    /**
     * Filter which ErrorReports to update
     */
    where?: ErrorReportWhereInput
    /**
     * Limit how many ErrorReports to update.
     */
    limit?: number
  }

  /**
   * ErrorReport updateManyAndReturn
   */
  export type ErrorReportUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ErrorReport
     */
    select?: ErrorReportSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ErrorReport
     */
    omit?: ErrorReportOmit<ExtArgs> | null
    /**
     * The data used to update ErrorReports.
     */
    data: XOR<ErrorReportUpdateManyMutationInput, ErrorReportUncheckedUpdateManyInput>
    /**
     * Filter which ErrorReports to update
     */
    where?: ErrorReportWhereInput
    /**
     * Limit how many ErrorReports to update.
     */
    limit?: number
  }

  /**
   * ErrorReport upsert
   */
  export type ErrorReportUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ErrorReport
     */
    select?: ErrorReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ErrorReport
     */
    omit?: ErrorReportOmit<ExtArgs> | null
    /**
     * The filter to search for the ErrorReport to update in case it exists.
     */
    where: ErrorReportWhereUniqueInput
    /**
     * In case the ErrorReport found by the `where` argument doesn't exist, create a new ErrorReport with this data.
     */
    create: XOR<ErrorReportCreateInput, ErrorReportUncheckedCreateInput>
    /**
     * In case the ErrorReport was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ErrorReportUpdateInput, ErrorReportUncheckedUpdateInput>
  }

  /**
   * ErrorReport delete
   */
  export type ErrorReportDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ErrorReport
     */
    select?: ErrorReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ErrorReport
     */
    omit?: ErrorReportOmit<ExtArgs> | null
    /**
     * Filter which ErrorReport to delete.
     */
    where: ErrorReportWhereUniqueInput
  }

  /**
   * ErrorReport deleteMany
   */
  export type ErrorReportDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ErrorReports to delete
     */
    where?: ErrorReportWhereInput
    /**
     * Limit how many ErrorReports to delete.
     */
    limit?: number
  }

  /**
   * ErrorReport without action
   */
  export type ErrorReportDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ErrorReport
     */
    select?: ErrorReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ErrorReport
     */
    omit?: ErrorReportOmit<ExtArgs> | null
  }


  /**
   * Model FinanceSettings
   */

  export type AggregateFinanceSettings = {
    _count: FinanceSettingsCountAggregateOutputType | null
    _avg: FinanceSettingsAvgAggregateOutputType | null
    _sum: FinanceSettingsSumAggregateOutputType | null
    _min: FinanceSettingsMinAggregateOutputType | null
    _max: FinanceSettingsMaxAggregateOutputType | null
  }

  export type FinanceSettingsAvgAggregateOutputType = {
    urssafRate: Decimal | null
    vatRate: Decimal | null
  }

  export type FinanceSettingsSumAggregateOutputType = {
    urssafRate: Decimal | null
    vatRate: Decimal | null
  }

  export type FinanceSettingsMinAggregateOutputType = {
    id: string | null
    urssafRate: Decimal | null
    vatRate: Decimal | null
    vatStatus: $Enums.FinanceVatStatus | null
    declarationFrequency: $Enums.FinanceDeclarationFrequency | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FinanceSettingsMaxAggregateOutputType = {
    id: string | null
    urssafRate: Decimal | null
    vatRate: Decimal | null
    vatStatus: $Enums.FinanceVatStatus | null
    declarationFrequency: $Enums.FinanceDeclarationFrequency | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FinanceSettingsCountAggregateOutputType = {
    id: number
    urssafRate: number
    vatRate: number
    vatStatus: number
    declarationFrequency: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type FinanceSettingsAvgAggregateInputType = {
    urssafRate?: true
    vatRate?: true
  }

  export type FinanceSettingsSumAggregateInputType = {
    urssafRate?: true
    vatRate?: true
  }

  export type FinanceSettingsMinAggregateInputType = {
    id?: true
    urssafRate?: true
    vatRate?: true
    vatStatus?: true
    declarationFrequency?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FinanceSettingsMaxAggregateInputType = {
    id?: true
    urssafRate?: true
    vatRate?: true
    vatStatus?: true
    declarationFrequency?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FinanceSettingsCountAggregateInputType = {
    id?: true
    urssafRate?: true
    vatRate?: true
    vatStatus?: true
    declarationFrequency?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type FinanceSettingsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FinanceSettings to aggregate.
     */
    where?: FinanceSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FinanceSettings to fetch.
     */
    orderBy?: FinanceSettingsOrderByWithRelationInput | FinanceSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FinanceSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FinanceSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FinanceSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned FinanceSettings
    **/
    _count?: true | FinanceSettingsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FinanceSettingsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FinanceSettingsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FinanceSettingsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FinanceSettingsMaxAggregateInputType
  }

  export type GetFinanceSettingsAggregateType<T extends FinanceSettingsAggregateArgs> = {
        [P in keyof T & keyof AggregateFinanceSettings]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFinanceSettings[P]>
      : GetScalarType<T[P], AggregateFinanceSettings[P]>
  }




  export type FinanceSettingsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FinanceSettingsWhereInput
    orderBy?: FinanceSettingsOrderByWithAggregationInput | FinanceSettingsOrderByWithAggregationInput[]
    by: FinanceSettingsScalarFieldEnum[] | FinanceSettingsScalarFieldEnum
    having?: FinanceSettingsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FinanceSettingsCountAggregateInputType | true
    _avg?: FinanceSettingsAvgAggregateInputType
    _sum?: FinanceSettingsSumAggregateInputType
    _min?: FinanceSettingsMinAggregateInputType
    _max?: FinanceSettingsMaxAggregateInputType
  }

  export type FinanceSettingsGroupByOutputType = {
    id: string
    urssafRate: Decimal
    vatRate: Decimal
    vatStatus: $Enums.FinanceVatStatus
    declarationFrequency: $Enums.FinanceDeclarationFrequency
    createdAt: Date
    updatedAt: Date
    _count: FinanceSettingsCountAggregateOutputType | null
    _avg: FinanceSettingsAvgAggregateOutputType | null
    _sum: FinanceSettingsSumAggregateOutputType | null
    _min: FinanceSettingsMinAggregateOutputType | null
    _max: FinanceSettingsMaxAggregateOutputType | null
  }

  type GetFinanceSettingsGroupByPayload<T extends FinanceSettingsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FinanceSettingsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FinanceSettingsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FinanceSettingsGroupByOutputType[P]>
            : GetScalarType<T[P], FinanceSettingsGroupByOutputType[P]>
        }
      >
    >


  export type FinanceSettingsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    urssafRate?: boolean
    vatRate?: boolean
    vatStatus?: boolean
    declarationFrequency?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["financeSettings"]>

  export type FinanceSettingsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    urssafRate?: boolean
    vatRate?: boolean
    vatStatus?: boolean
    declarationFrequency?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["financeSettings"]>

  export type FinanceSettingsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    urssafRate?: boolean
    vatRate?: boolean
    vatStatus?: boolean
    declarationFrequency?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["financeSettings"]>

  export type FinanceSettingsSelectScalar = {
    id?: boolean
    urssafRate?: boolean
    vatRate?: boolean
    vatStatus?: boolean
    declarationFrequency?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type FinanceSettingsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "urssafRate" | "vatRate" | "vatStatus" | "declarationFrequency" | "createdAt" | "updatedAt", ExtArgs["result"]["financeSettings"]>

  export type $FinanceSettingsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "FinanceSettings"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      urssafRate: Prisma.Decimal
      vatRate: Prisma.Decimal
      vatStatus: $Enums.FinanceVatStatus
      declarationFrequency: $Enums.FinanceDeclarationFrequency
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["financeSettings"]>
    composites: {}
  }

  type FinanceSettingsGetPayload<S extends boolean | null | undefined | FinanceSettingsDefaultArgs> = $Result.GetResult<Prisma.$FinanceSettingsPayload, S>

  type FinanceSettingsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FinanceSettingsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FinanceSettingsCountAggregateInputType | true
    }

  export interface FinanceSettingsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['FinanceSettings'], meta: { name: 'FinanceSettings' } }
    /**
     * Find zero or one FinanceSettings that matches the filter.
     * @param {FinanceSettingsFindUniqueArgs} args - Arguments to find a FinanceSettings
     * @example
     * // Get one FinanceSettings
     * const financeSettings = await prisma.financeSettings.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FinanceSettingsFindUniqueArgs>(args: SelectSubset<T, FinanceSettingsFindUniqueArgs<ExtArgs>>): Prisma__FinanceSettingsClient<$Result.GetResult<Prisma.$FinanceSettingsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one FinanceSettings that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FinanceSettingsFindUniqueOrThrowArgs} args - Arguments to find a FinanceSettings
     * @example
     * // Get one FinanceSettings
     * const financeSettings = await prisma.financeSettings.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FinanceSettingsFindUniqueOrThrowArgs>(args: SelectSubset<T, FinanceSettingsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FinanceSettingsClient<$Result.GetResult<Prisma.$FinanceSettingsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FinanceSettings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FinanceSettingsFindFirstArgs} args - Arguments to find a FinanceSettings
     * @example
     * // Get one FinanceSettings
     * const financeSettings = await prisma.financeSettings.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FinanceSettingsFindFirstArgs>(args?: SelectSubset<T, FinanceSettingsFindFirstArgs<ExtArgs>>): Prisma__FinanceSettingsClient<$Result.GetResult<Prisma.$FinanceSettingsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FinanceSettings that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FinanceSettingsFindFirstOrThrowArgs} args - Arguments to find a FinanceSettings
     * @example
     * // Get one FinanceSettings
     * const financeSettings = await prisma.financeSettings.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FinanceSettingsFindFirstOrThrowArgs>(args?: SelectSubset<T, FinanceSettingsFindFirstOrThrowArgs<ExtArgs>>): Prisma__FinanceSettingsClient<$Result.GetResult<Prisma.$FinanceSettingsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more FinanceSettings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FinanceSettingsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FinanceSettings
     * const financeSettings = await prisma.financeSettings.findMany()
     * 
     * // Get first 10 FinanceSettings
     * const financeSettings = await prisma.financeSettings.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const financeSettingsWithIdOnly = await prisma.financeSettings.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FinanceSettingsFindManyArgs>(args?: SelectSubset<T, FinanceSettingsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FinanceSettingsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a FinanceSettings.
     * @param {FinanceSettingsCreateArgs} args - Arguments to create a FinanceSettings.
     * @example
     * // Create one FinanceSettings
     * const FinanceSettings = await prisma.financeSettings.create({
     *   data: {
     *     // ... data to create a FinanceSettings
     *   }
     * })
     * 
     */
    create<T extends FinanceSettingsCreateArgs>(args: SelectSubset<T, FinanceSettingsCreateArgs<ExtArgs>>): Prisma__FinanceSettingsClient<$Result.GetResult<Prisma.$FinanceSettingsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many FinanceSettings.
     * @param {FinanceSettingsCreateManyArgs} args - Arguments to create many FinanceSettings.
     * @example
     * // Create many FinanceSettings
     * const financeSettings = await prisma.financeSettings.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FinanceSettingsCreateManyArgs>(args?: SelectSubset<T, FinanceSettingsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many FinanceSettings and returns the data saved in the database.
     * @param {FinanceSettingsCreateManyAndReturnArgs} args - Arguments to create many FinanceSettings.
     * @example
     * // Create many FinanceSettings
     * const financeSettings = await prisma.financeSettings.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many FinanceSettings and only return the `id`
     * const financeSettingsWithIdOnly = await prisma.financeSettings.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FinanceSettingsCreateManyAndReturnArgs>(args?: SelectSubset<T, FinanceSettingsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FinanceSettingsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a FinanceSettings.
     * @param {FinanceSettingsDeleteArgs} args - Arguments to delete one FinanceSettings.
     * @example
     * // Delete one FinanceSettings
     * const FinanceSettings = await prisma.financeSettings.delete({
     *   where: {
     *     // ... filter to delete one FinanceSettings
     *   }
     * })
     * 
     */
    delete<T extends FinanceSettingsDeleteArgs>(args: SelectSubset<T, FinanceSettingsDeleteArgs<ExtArgs>>): Prisma__FinanceSettingsClient<$Result.GetResult<Prisma.$FinanceSettingsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one FinanceSettings.
     * @param {FinanceSettingsUpdateArgs} args - Arguments to update one FinanceSettings.
     * @example
     * // Update one FinanceSettings
     * const financeSettings = await prisma.financeSettings.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FinanceSettingsUpdateArgs>(args: SelectSubset<T, FinanceSettingsUpdateArgs<ExtArgs>>): Prisma__FinanceSettingsClient<$Result.GetResult<Prisma.$FinanceSettingsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more FinanceSettings.
     * @param {FinanceSettingsDeleteManyArgs} args - Arguments to filter FinanceSettings to delete.
     * @example
     * // Delete a few FinanceSettings
     * const { count } = await prisma.financeSettings.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FinanceSettingsDeleteManyArgs>(args?: SelectSubset<T, FinanceSettingsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FinanceSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FinanceSettingsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FinanceSettings
     * const financeSettings = await prisma.financeSettings.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FinanceSettingsUpdateManyArgs>(args: SelectSubset<T, FinanceSettingsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FinanceSettings and returns the data updated in the database.
     * @param {FinanceSettingsUpdateManyAndReturnArgs} args - Arguments to update many FinanceSettings.
     * @example
     * // Update many FinanceSettings
     * const financeSettings = await prisma.financeSettings.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more FinanceSettings and only return the `id`
     * const financeSettingsWithIdOnly = await prisma.financeSettings.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends FinanceSettingsUpdateManyAndReturnArgs>(args: SelectSubset<T, FinanceSettingsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FinanceSettingsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one FinanceSettings.
     * @param {FinanceSettingsUpsertArgs} args - Arguments to update or create a FinanceSettings.
     * @example
     * // Update or create a FinanceSettings
     * const financeSettings = await prisma.financeSettings.upsert({
     *   create: {
     *     // ... data to create a FinanceSettings
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FinanceSettings we want to update
     *   }
     * })
     */
    upsert<T extends FinanceSettingsUpsertArgs>(args: SelectSubset<T, FinanceSettingsUpsertArgs<ExtArgs>>): Prisma__FinanceSettingsClient<$Result.GetResult<Prisma.$FinanceSettingsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of FinanceSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FinanceSettingsCountArgs} args - Arguments to filter FinanceSettings to count.
     * @example
     * // Count the number of FinanceSettings
     * const count = await prisma.financeSettings.count({
     *   where: {
     *     // ... the filter for the FinanceSettings we want to count
     *   }
     * })
    **/
    count<T extends FinanceSettingsCountArgs>(
      args?: Subset<T, FinanceSettingsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FinanceSettingsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a FinanceSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FinanceSettingsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FinanceSettingsAggregateArgs>(args: Subset<T, FinanceSettingsAggregateArgs>): Prisma.PrismaPromise<GetFinanceSettingsAggregateType<T>>

    /**
     * Group by FinanceSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FinanceSettingsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FinanceSettingsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FinanceSettingsGroupByArgs['orderBy'] }
        : { orderBy?: FinanceSettingsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FinanceSettingsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFinanceSettingsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the FinanceSettings model
   */
  readonly fields: FinanceSettingsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for FinanceSettings.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FinanceSettingsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the FinanceSettings model
   */
  interface FinanceSettingsFieldRefs {
    readonly id: FieldRef<"FinanceSettings", 'String'>
    readonly urssafRate: FieldRef<"FinanceSettings", 'Decimal'>
    readonly vatRate: FieldRef<"FinanceSettings", 'Decimal'>
    readonly vatStatus: FieldRef<"FinanceSettings", 'FinanceVatStatus'>
    readonly declarationFrequency: FieldRef<"FinanceSettings", 'FinanceDeclarationFrequency'>
    readonly createdAt: FieldRef<"FinanceSettings", 'DateTime'>
    readonly updatedAt: FieldRef<"FinanceSettings", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * FinanceSettings findUnique
   */
  export type FinanceSettingsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FinanceSettings
     */
    select?: FinanceSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FinanceSettings
     */
    omit?: FinanceSettingsOmit<ExtArgs> | null
    /**
     * Filter, which FinanceSettings to fetch.
     */
    where: FinanceSettingsWhereUniqueInput
  }

  /**
   * FinanceSettings findUniqueOrThrow
   */
  export type FinanceSettingsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FinanceSettings
     */
    select?: FinanceSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FinanceSettings
     */
    omit?: FinanceSettingsOmit<ExtArgs> | null
    /**
     * Filter, which FinanceSettings to fetch.
     */
    where: FinanceSettingsWhereUniqueInput
  }

  /**
   * FinanceSettings findFirst
   */
  export type FinanceSettingsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FinanceSettings
     */
    select?: FinanceSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FinanceSettings
     */
    omit?: FinanceSettingsOmit<ExtArgs> | null
    /**
     * Filter, which FinanceSettings to fetch.
     */
    where?: FinanceSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FinanceSettings to fetch.
     */
    orderBy?: FinanceSettingsOrderByWithRelationInput | FinanceSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FinanceSettings.
     */
    cursor?: FinanceSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FinanceSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FinanceSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FinanceSettings.
     */
    distinct?: FinanceSettingsScalarFieldEnum | FinanceSettingsScalarFieldEnum[]
  }

  /**
   * FinanceSettings findFirstOrThrow
   */
  export type FinanceSettingsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FinanceSettings
     */
    select?: FinanceSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FinanceSettings
     */
    omit?: FinanceSettingsOmit<ExtArgs> | null
    /**
     * Filter, which FinanceSettings to fetch.
     */
    where?: FinanceSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FinanceSettings to fetch.
     */
    orderBy?: FinanceSettingsOrderByWithRelationInput | FinanceSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FinanceSettings.
     */
    cursor?: FinanceSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FinanceSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FinanceSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FinanceSettings.
     */
    distinct?: FinanceSettingsScalarFieldEnum | FinanceSettingsScalarFieldEnum[]
  }

  /**
   * FinanceSettings findMany
   */
  export type FinanceSettingsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FinanceSettings
     */
    select?: FinanceSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FinanceSettings
     */
    omit?: FinanceSettingsOmit<ExtArgs> | null
    /**
     * Filter, which FinanceSettings to fetch.
     */
    where?: FinanceSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FinanceSettings to fetch.
     */
    orderBy?: FinanceSettingsOrderByWithRelationInput | FinanceSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing FinanceSettings.
     */
    cursor?: FinanceSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FinanceSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FinanceSettings.
     */
    skip?: number
    distinct?: FinanceSettingsScalarFieldEnum | FinanceSettingsScalarFieldEnum[]
  }

  /**
   * FinanceSettings create
   */
  export type FinanceSettingsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FinanceSettings
     */
    select?: FinanceSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FinanceSettings
     */
    omit?: FinanceSettingsOmit<ExtArgs> | null
    /**
     * The data needed to create a FinanceSettings.
     */
    data: XOR<FinanceSettingsCreateInput, FinanceSettingsUncheckedCreateInput>
  }

  /**
   * FinanceSettings createMany
   */
  export type FinanceSettingsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many FinanceSettings.
     */
    data: FinanceSettingsCreateManyInput | FinanceSettingsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FinanceSettings createManyAndReturn
   */
  export type FinanceSettingsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FinanceSettings
     */
    select?: FinanceSettingsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FinanceSettings
     */
    omit?: FinanceSettingsOmit<ExtArgs> | null
    /**
     * The data used to create many FinanceSettings.
     */
    data: FinanceSettingsCreateManyInput | FinanceSettingsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FinanceSettings update
   */
  export type FinanceSettingsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FinanceSettings
     */
    select?: FinanceSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FinanceSettings
     */
    omit?: FinanceSettingsOmit<ExtArgs> | null
    /**
     * The data needed to update a FinanceSettings.
     */
    data: XOR<FinanceSettingsUpdateInput, FinanceSettingsUncheckedUpdateInput>
    /**
     * Choose, which FinanceSettings to update.
     */
    where: FinanceSettingsWhereUniqueInput
  }

  /**
   * FinanceSettings updateMany
   */
  export type FinanceSettingsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update FinanceSettings.
     */
    data: XOR<FinanceSettingsUpdateManyMutationInput, FinanceSettingsUncheckedUpdateManyInput>
    /**
     * Filter which FinanceSettings to update
     */
    where?: FinanceSettingsWhereInput
    /**
     * Limit how many FinanceSettings to update.
     */
    limit?: number
  }

  /**
   * FinanceSettings updateManyAndReturn
   */
  export type FinanceSettingsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FinanceSettings
     */
    select?: FinanceSettingsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FinanceSettings
     */
    omit?: FinanceSettingsOmit<ExtArgs> | null
    /**
     * The data used to update FinanceSettings.
     */
    data: XOR<FinanceSettingsUpdateManyMutationInput, FinanceSettingsUncheckedUpdateManyInput>
    /**
     * Filter which FinanceSettings to update
     */
    where?: FinanceSettingsWhereInput
    /**
     * Limit how many FinanceSettings to update.
     */
    limit?: number
  }

  /**
   * FinanceSettings upsert
   */
  export type FinanceSettingsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FinanceSettings
     */
    select?: FinanceSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FinanceSettings
     */
    omit?: FinanceSettingsOmit<ExtArgs> | null
    /**
     * The filter to search for the FinanceSettings to update in case it exists.
     */
    where: FinanceSettingsWhereUniqueInput
    /**
     * In case the FinanceSettings found by the `where` argument doesn't exist, create a new FinanceSettings with this data.
     */
    create: XOR<FinanceSettingsCreateInput, FinanceSettingsUncheckedCreateInput>
    /**
     * In case the FinanceSettings was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FinanceSettingsUpdateInput, FinanceSettingsUncheckedUpdateInput>
  }

  /**
   * FinanceSettings delete
   */
  export type FinanceSettingsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FinanceSettings
     */
    select?: FinanceSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FinanceSettings
     */
    omit?: FinanceSettingsOmit<ExtArgs> | null
    /**
     * Filter which FinanceSettings to delete.
     */
    where: FinanceSettingsWhereUniqueInput
  }

  /**
   * FinanceSettings deleteMany
   */
  export type FinanceSettingsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FinanceSettings to delete
     */
    where?: FinanceSettingsWhereInput
    /**
     * Limit how many FinanceSettings to delete.
     */
    limit?: number
  }

  /**
   * FinanceSettings without action
   */
  export type FinanceSettingsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FinanceSettings
     */
    select?: FinanceSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FinanceSettings
     */
    omit?: FinanceSettingsOmit<ExtArgs> | null
  }


  /**
   * Model LysmaExpense
   */

  export type AggregateLysmaExpense = {
    _count: LysmaExpenseCountAggregateOutputType | null
    _avg: LysmaExpenseAvgAggregateOutputType | null
    _sum: LysmaExpenseSumAggregateOutputType | null
    _min: LysmaExpenseMinAggregateOutputType | null
    _max: LysmaExpenseMaxAggregateOutputType | null
  }

  export type LysmaExpenseAvgAggregateOutputType = {
    amountHT: Decimal | null
    vatAmount: Decimal | null
    amountTTC: Decimal | null
  }

  export type LysmaExpenseSumAggregateOutputType = {
    amountHT: Decimal | null
    vatAmount: Decimal | null
    amountTTC: Decimal | null
  }

  export type LysmaExpenseMinAggregateOutputType = {
    id: string | null
    name: string | null
    provider: string | null
    category: $Enums.ExpenseCategory | null
    relatedTool: $Enums.FinanceTool | null
    amountHT: Decimal | null
    vatAmount: Decimal | null
    amountTTC: Decimal | null
    frequency: $Enums.FinanceFrequency | null
    startDate: Date | null
    renewalDate: Date | null
    paymentMethod: string | null
    status: $Enums.ExpenseStatus | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LysmaExpenseMaxAggregateOutputType = {
    id: string | null
    name: string | null
    provider: string | null
    category: $Enums.ExpenseCategory | null
    relatedTool: $Enums.FinanceTool | null
    amountHT: Decimal | null
    vatAmount: Decimal | null
    amountTTC: Decimal | null
    frequency: $Enums.FinanceFrequency | null
    startDate: Date | null
    renewalDate: Date | null
    paymentMethod: string | null
    status: $Enums.ExpenseStatus | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LysmaExpenseCountAggregateOutputType = {
    id: number
    name: number
    provider: number
    category: number
    relatedTool: number
    amountHT: number
    vatAmount: number
    amountTTC: number
    frequency: number
    startDate: number
    renewalDate: number
    paymentMethod: number
    status: number
    notes: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type LysmaExpenseAvgAggregateInputType = {
    amountHT?: true
    vatAmount?: true
    amountTTC?: true
  }

  export type LysmaExpenseSumAggregateInputType = {
    amountHT?: true
    vatAmount?: true
    amountTTC?: true
  }

  export type LysmaExpenseMinAggregateInputType = {
    id?: true
    name?: true
    provider?: true
    category?: true
    relatedTool?: true
    amountHT?: true
    vatAmount?: true
    amountTTC?: true
    frequency?: true
    startDate?: true
    renewalDate?: true
    paymentMethod?: true
    status?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LysmaExpenseMaxAggregateInputType = {
    id?: true
    name?: true
    provider?: true
    category?: true
    relatedTool?: true
    amountHT?: true
    vatAmount?: true
    amountTTC?: true
    frequency?: true
    startDate?: true
    renewalDate?: true
    paymentMethod?: true
    status?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LysmaExpenseCountAggregateInputType = {
    id?: true
    name?: true
    provider?: true
    category?: true
    relatedTool?: true
    amountHT?: true
    vatAmount?: true
    amountTTC?: true
    frequency?: true
    startDate?: true
    renewalDate?: true
    paymentMethod?: true
    status?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type LysmaExpenseAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LysmaExpense to aggregate.
     */
    where?: LysmaExpenseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LysmaExpenses to fetch.
     */
    orderBy?: LysmaExpenseOrderByWithRelationInput | LysmaExpenseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LysmaExpenseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LysmaExpenses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LysmaExpenses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LysmaExpenses
    **/
    _count?: true | LysmaExpenseCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LysmaExpenseAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LysmaExpenseSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LysmaExpenseMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LysmaExpenseMaxAggregateInputType
  }

  export type GetLysmaExpenseAggregateType<T extends LysmaExpenseAggregateArgs> = {
        [P in keyof T & keyof AggregateLysmaExpense]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLysmaExpense[P]>
      : GetScalarType<T[P], AggregateLysmaExpense[P]>
  }




  export type LysmaExpenseGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LysmaExpenseWhereInput
    orderBy?: LysmaExpenseOrderByWithAggregationInput | LysmaExpenseOrderByWithAggregationInput[]
    by: LysmaExpenseScalarFieldEnum[] | LysmaExpenseScalarFieldEnum
    having?: LysmaExpenseScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LysmaExpenseCountAggregateInputType | true
    _avg?: LysmaExpenseAvgAggregateInputType
    _sum?: LysmaExpenseSumAggregateInputType
    _min?: LysmaExpenseMinAggregateInputType
    _max?: LysmaExpenseMaxAggregateInputType
  }

  export type LysmaExpenseGroupByOutputType = {
    id: string
    name: string
    provider: string
    category: $Enums.ExpenseCategory
    relatedTool: $Enums.FinanceTool
    amountHT: Decimal
    vatAmount: Decimal
    amountTTC: Decimal
    frequency: $Enums.FinanceFrequency
    startDate: Date
    renewalDate: Date | null
    paymentMethod: string | null
    status: $Enums.ExpenseStatus
    notes: string | null
    createdAt: Date
    updatedAt: Date
    _count: LysmaExpenseCountAggregateOutputType | null
    _avg: LysmaExpenseAvgAggregateOutputType | null
    _sum: LysmaExpenseSumAggregateOutputType | null
    _min: LysmaExpenseMinAggregateOutputType | null
    _max: LysmaExpenseMaxAggregateOutputType | null
  }

  type GetLysmaExpenseGroupByPayload<T extends LysmaExpenseGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LysmaExpenseGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LysmaExpenseGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LysmaExpenseGroupByOutputType[P]>
            : GetScalarType<T[P], LysmaExpenseGroupByOutputType[P]>
        }
      >
    >


  export type LysmaExpenseSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    provider?: boolean
    category?: boolean
    relatedTool?: boolean
    amountHT?: boolean
    vatAmount?: boolean
    amountTTC?: boolean
    frequency?: boolean
    startDate?: boolean
    renewalDate?: boolean
    paymentMethod?: boolean
    status?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["lysmaExpense"]>

  export type LysmaExpenseSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    provider?: boolean
    category?: boolean
    relatedTool?: boolean
    amountHT?: boolean
    vatAmount?: boolean
    amountTTC?: boolean
    frequency?: boolean
    startDate?: boolean
    renewalDate?: boolean
    paymentMethod?: boolean
    status?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["lysmaExpense"]>

  export type LysmaExpenseSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    provider?: boolean
    category?: boolean
    relatedTool?: boolean
    amountHT?: boolean
    vatAmount?: boolean
    amountTTC?: boolean
    frequency?: boolean
    startDate?: boolean
    renewalDate?: boolean
    paymentMethod?: boolean
    status?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["lysmaExpense"]>

  export type LysmaExpenseSelectScalar = {
    id?: boolean
    name?: boolean
    provider?: boolean
    category?: boolean
    relatedTool?: boolean
    amountHT?: boolean
    vatAmount?: boolean
    amountTTC?: boolean
    frequency?: boolean
    startDate?: boolean
    renewalDate?: boolean
    paymentMethod?: boolean
    status?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type LysmaExpenseOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "provider" | "category" | "relatedTool" | "amountHT" | "vatAmount" | "amountTTC" | "frequency" | "startDate" | "renewalDate" | "paymentMethod" | "status" | "notes" | "createdAt" | "updatedAt", ExtArgs["result"]["lysmaExpense"]>

  export type $LysmaExpensePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LysmaExpense"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      provider: string
      category: $Enums.ExpenseCategory
      relatedTool: $Enums.FinanceTool
      amountHT: Prisma.Decimal
      vatAmount: Prisma.Decimal
      amountTTC: Prisma.Decimal
      frequency: $Enums.FinanceFrequency
      startDate: Date
      renewalDate: Date | null
      paymentMethod: string | null
      status: $Enums.ExpenseStatus
      notes: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["lysmaExpense"]>
    composites: {}
  }

  type LysmaExpenseGetPayload<S extends boolean | null | undefined | LysmaExpenseDefaultArgs> = $Result.GetResult<Prisma.$LysmaExpensePayload, S>

  type LysmaExpenseCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LysmaExpenseFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LysmaExpenseCountAggregateInputType | true
    }

  export interface LysmaExpenseDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LysmaExpense'], meta: { name: 'LysmaExpense' } }
    /**
     * Find zero or one LysmaExpense that matches the filter.
     * @param {LysmaExpenseFindUniqueArgs} args - Arguments to find a LysmaExpense
     * @example
     * // Get one LysmaExpense
     * const lysmaExpense = await prisma.lysmaExpense.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LysmaExpenseFindUniqueArgs>(args: SelectSubset<T, LysmaExpenseFindUniqueArgs<ExtArgs>>): Prisma__LysmaExpenseClient<$Result.GetResult<Prisma.$LysmaExpensePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LysmaExpense that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LysmaExpenseFindUniqueOrThrowArgs} args - Arguments to find a LysmaExpense
     * @example
     * // Get one LysmaExpense
     * const lysmaExpense = await prisma.lysmaExpense.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LysmaExpenseFindUniqueOrThrowArgs>(args: SelectSubset<T, LysmaExpenseFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LysmaExpenseClient<$Result.GetResult<Prisma.$LysmaExpensePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LysmaExpense that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LysmaExpenseFindFirstArgs} args - Arguments to find a LysmaExpense
     * @example
     * // Get one LysmaExpense
     * const lysmaExpense = await prisma.lysmaExpense.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LysmaExpenseFindFirstArgs>(args?: SelectSubset<T, LysmaExpenseFindFirstArgs<ExtArgs>>): Prisma__LysmaExpenseClient<$Result.GetResult<Prisma.$LysmaExpensePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LysmaExpense that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LysmaExpenseFindFirstOrThrowArgs} args - Arguments to find a LysmaExpense
     * @example
     * // Get one LysmaExpense
     * const lysmaExpense = await prisma.lysmaExpense.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LysmaExpenseFindFirstOrThrowArgs>(args?: SelectSubset<T, LysmaExpenseFindFirstOrThrowArgs<ExtArgs>>): Prisma__LysmaExpenseClient<$Result.GetResult<Prisma.$LysmaExpensePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LysmaExpenses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LysmaExpenseFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LysmaExpenses
     * const lysmaExpenses = await prisma.lysmaExpense.findMany()
     * 
     * // Get first 10 LysmaExpenses
     * const lysmaExpenses = await prisma.lysmaExpense.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const lysmaExpenseWithIdOnly = await prisma.lysmaExpense.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LysmaExpenseFindManyArgs>(args?: SelectSubset<T, LysmaExpenseFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LysmaExpensePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LysmaExpense.
     * @param {LysmaExpenseCreateArgs} args - Arguments to create a LysmaExpense.
     * @example
     * // Create one LysmaExpense
     * const LysmaExpense = await prisma.lysmaExpense.create({
     *   data: {
     *     // ... data to create a LysmaExpense
     *   }
     * })
     * 
     */
    create<T extends LysmaExpenseCreateArgs>(args: SelectSubset<T, LysmaExpenseCreateArgs<ExtArgs>>): Prisma__LysmaExpenseClient<$Result.GetResult<Prisma.$LysmaExpensePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LysmaExpenses.
     * @param {LysmaExpenseCreateManyArgs} args - Arguments to create many LysmaExpenses.
     * @example
     * // Create many LysmaExpenses
     * const lysmaExpense = await prisma.lysmaExpense.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LysmaExpenseCreateManyArgs>(args?: SelectSubset<T, LysmaExpenseCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LysmaExpenses and returns the data saved in the database.
     * @param {LysmaExpenseCreateManyAndReturnArgs} args - Arguments to create many LysmaExpenses.
     * @example
     * // Create many LysmaExpenses
     * const lysmaExpense = await prisma.lysmaExpense.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LysmaExpenses and only return the `id`
     * const lysmaExpenseWithIdOnly = await prisma.lysmaExpense.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LysmaExpenseCreateManyAndReturnArgs>(args?: SelectSubset<T, LysmaExpenseCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LysmaExpensePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a LysmaExpense.
     * @param {LysmaExpenseDeleteArgs} args - Arguments to delete one LysmaExpense.
     * @example
     * // Delete one LysmaExpense
     * const LysmaExpense = await prisma.lysmaExpense.delete({
     *   where: {
     *     // ... filter to delete one LysmaExpense
     *   }
     * })
     * 
     */
    delete<T extends LysmaExpenseDeleteArgs>(args: SelectSubset<T, LysmaExpenseDeleteArgs<ExtArgs>>): Prisma__LysmaExpenseClient<$Result.GetResult<Prisma.$LysmaExpensePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LysmaExpense.
     * @param {LysmaExpenseUpdateArgs} args - Arguments to update one LysmaExpense.
     * @example
     * // Update one LysmaExpense
     * const lysmaExpense = await prisma.lysmaExpense.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LysmaExpenseUpdateArgs>(args: SelectSubset<T, LysmaExpenseUpdateArgs<ExtArgs>>): Prisma__LysmaExpenseClient<$Result.GetResult<Prisma.$LysmaExpensePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LysmaExpenses.
     * @param {LysmaExpenseDeleteManyArgs} args - Arguments to filter LysmaExpenses to delete.
     * @example
     * // Delete a few LysmaExpenses
     * const { count } = await prisma.lysmaExpense.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LysmaExpenseDeleteManyArgs>(args?: SelectSubset<T, LysmaExpenseDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LysmaExpenses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LysmaExpenseUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LysmaExpenses
     * const lysmaExpense = await prisma.lysmaExpense.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LysmaExpenseUpdateManyArgs>(args: SelectSubset<T, LysmaExpenseUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LysmaExpenses and returns the data updated in the database.
     * @param {LysmaExpenseUpdateManyAndReturnArgs} args - Arguments to update many LysmaExpenses.
     * @example
     * // Update many LysmaExpenses
     * const lysmaExpense = await prisma.lysmaExpense.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more LysmaExpenses and only return the `id`
     * const lysmaExpenseWithIdOnly = await prisma.lysmaExpense.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LysmaExpenseUpdateManyAndReturnArgs>(args: SelectSubset<T, LysmaExpenseUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LysmaExpensePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one LysmaExpense.
     * @param {LysmaExpenseUpsertArgs} args - Arguments to update or create a LysmaExpense.
     * @example
     * // Update or create a LysmaExpense
     * const lysmaExpense = await prisma.lysmaExpense.upsert({
     *   create: {
     *     // ... data to create a LysmaExpense
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LysmaExpense we want to update
     *   }
     * })
     */
    upsert<T extends LysmaExpenseUpsertArgs>(args: SelectSubset<T, LysmaExpenseUpsertArgs<ExtArgs>>): Prisma__LysmaExpenseClient<$Result.GetResult<Prisma.$LysmaExpensePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LysmaExpenses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LysmaExpenseCountArgs} args - Arguments to filter LysmaExpenses to count.
     * @example
     * // Count the number of LysmaExpenses
     * const count = await prisma.lysmaExpense.count({
     *   where: {
     *     // ... the filter for the LysmaExpenses we want to count
     *   }
     * })
    **/
    count<T extends LysmaExpenseCountArgs>(
      args?: Subset<T, LysmaExpenseCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LysmaExpenseCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LysmaExpense.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LysmaExpenseAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LysmaExpenseAggregateArgs>(args: Subset<T, LysmaExpenseAggregateArgs>): Prisma.PrismaPromise<GetLysmaExpenseAggregateType<T>>

    /**
     * Group by LysmaExpense.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LysmaExpenseGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LysmaExpenseGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LysmaExpenseGroupByArgs['orderBy'] }
        : { orderBy?: LysmaExpenseGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LysmaExpenseGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLysmaExpenseGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LysmaExpense model
   */
  readonly fields: LysmaExpenseFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LysmaExpense.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LysmaExpenseClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LysmaExpense model
   */
  interface LysmaExpenseFieldRefs {
    readonly id: FieldRef<"LysmaExpense", 'String'>
    readonly name: FieldRef<"LysmaExpense", 'String'>
    readonly provider: FieldRef<"LysmaExpense", 'String'>
    readonly category: FieldRef<"LysmaExpense", 'ExpenseCategory'>
    readonly relatedTool: FieldRef<"LysmaExpense", 'FinanceTool'>
    readonly amountHT: FieldRef<"LysmaExpense", 'Decimal'>
    readonly vatAmount: FieldRef<"LysmaExpense", 'Decimal'>
    readonly amountTTC: FieldRef<"LysmaExpense", 'Decimal'>
    readonly frequency: FieldRef<"LysmaExpense", 'FinanceFrequency'>
    readonly startDate: FieldRef<"LysmaExpense", 'DateTime'>
    readonly renewalDate: FieldRef<"LysmaExpense", 'DateTime'>
    readonly paymentMethod: FieldRef<"LysmaExpense", 'String'>
    readonly status: FieldRef<"LysmaExpense", 'ExpenseStatus'>
    readonly notes: FieldRef<"LysmaExpense", 'String'>
    readonly createdAt: FieldRef<"LysmaExpense", 'DateTime'>
    readonly updatedAt: FieldRef<"LysmaExpense", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LysmaExpense findUnique
   */
  export type LysmaExpenseFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LysmaExpense
     */
    select?: LysmaExpenseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LysmaExpense
     */
    omit?: LysmaExpenseOmit<ExtArgs> | null
    /**
     * Filter, which LysmaExpense to fetch.
     */
    where: LysmaExpenseWhereUniqueInput
  }

  /**
   * LysmaExpense findUniqueOrThrow
   */
  export type LysmaExpenseFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LysmaExpense
     */
    select?: LysmaExpenseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LysmaExpense
     */
    omit?: LysmaExpenseOmit<ExtArgs> | null
    /**
     * Filter, which LysmaExpense to fetch.
     */
    where: LysmaExpenseWhereUniqueInput
  }

  /**
   * LysmaExpense findFirst
   */
  export type LysmaExpenseFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LysmaExpense
     */
    select?: LysmaExpenseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LysmaExpense
     */
    omit?: LysmaExpenseOmit<ExtArgs> | null
    /**
     * Filter, which LysmaExpense to fetch.
     */
    where?: LysmaExpenseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LysmaExpenses to fetch.
     */
    orderBy?: LysmaExpenseOrderByWithRelationInput | LysmaExpenseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LysmaExpenses.
     */
    cursor?: LysmaExpenseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LysmaExpenses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LysmaExpenses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LysmaExpenses.
     */
    distinct?: LysmaExpenseScalarFieldEnum | LysmaExpenseScalarFieldEnum[]
  }

  /**
   * LysmaExpense findFirstOrThrow
   */
  export type LysmaExpenseFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LysmaExpense
     */
    select?: LysmaExpenseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LysmaExpense
     */
    omit?: LysmaExpenseOmit<ExtArgs> | null
    /**
     * Filter, which LysmaExpense to fetch.
     */
    where?: LysmaExpenseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LysmaExpenses to fetch.
     */
    orderBy?: LysmaExpenseOrderByWithRelationInput | LysmaExpenseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LysmaExpenses.
     */
    cursor?: LysmaExpenseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LysmaExpenses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LysmaExpenses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LysmaExpenses.
     */
    distinct?: LysmaExpenseScalarFieldEnum | LysmaExpenseScalarFieldEnum[]
  }

  /**
   * LysmaExpense findMany
   */
  export type LysmaExpenseFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LysmaExpense
     */
    select?: LysmaExpenseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LysmaExpense
     */
    omit?: LysmaExpenseOmit<ExtArgs> | null
    /**
     * Filter, which LysmaExpenses to fetch.
     */
    where?: LysmaExpenseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LysmaExpenses to fetch.
     */
    orderBy?: LysmaExpenseOrderByWithRelationInput | LysmaExpenseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LysmaExpenses.
     */
    cursor?: LysmaExpenseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LysmaExpenses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LysmaExpenses.
     */
    skip?: number
    distinct?: LysmaExpenseScalarFieldEnum | LysmaExpenseScalarFieldEnum[]
  }

  /**
   * LysmaExpense create
   */
  export type LysmaExpenseCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LysmaExpense
     */
    select?: LysmaExpenseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LysmaExpense
     */
    omit?: LysmaExpenseOmit<ExtArgs> | null
    /**
     * The data needed to create a LysmaExpense.
     */
    data: XOR<LysmaExpenseCreateInput, LysmaExpenseUncheckedCreateInput>
  }

  /**
   * LysmaExpense createMany
   */
  export type LysmaExpenseCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LysmaExpenses.
     */
    data: LysmaExpenseCreateManyInput | LysmaExpenseCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LysmaExpense createManyAndReturn
   */
  export type LysmaExpenseCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LysmaExpense
     */
    select?: LysmaExpenseSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LysmaExpense
     */
    omit?: LysmaExpenseOmit<ExtArgs> | null
    /**
     * The data used to create many LysmaExpenses.
     */
    data: LysmaExpenseCreateManyInput | LysmaExpenseCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LysmaExpense update
   */
  export type LysmaExpenseUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LysmaExpense
     */
    select?: LysmaExpenseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LysmaExpense
     */
    omit?: LysmaExpenseOmit<ExtArgs> | null
    /**
     * The data needed to update a LysmaExpense.
     */
    data: XOR<LysmaExpenseUpdateInput, LysmaExpenseUncheckedUpdateInput>
    /**
     * Choose, which LysmaExpense to update.
     */
    where: LysmaExpenseWhereUniqueInput
  }

  /**
   * LysmaExpense updateMany
   */
  export type LysmaExpenseUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LysmaExpenses.
     */
    data: XOR<LysmaExpenseUpdateManyMutationInput, LysmaExpenseUncheckedUpdateManyInput>
    /**
     * Filter which LysmaExpenses to update
     */
    where?: LysmaExpenseWhereInput
    /**
     * Limit how many LysmaExpenses to update.
     */
    limit?: number
  }

  /**
   * LysmaExpense updateManyAndReturn
   */
  export type LysmaExpenseUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LysmaExpense
     */
    select?: LysmaExpenseSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LysmaExpense
     */
    omit?: LysmaExpenseOmit<ExtArgs> | null
    /**
     * The data used to update LysmaExpenses.
     */
    data: XOR<LysmaExpenseUpdateManyMutationInput, LysmaExpenseUncheckedUpdateManyInput>
    /**
     * Filter which LysmaExpenses to update
     */
    where?: LysmaExpenseWhereInput
    /**
     * Limit how many LysmaExpenses to update.
     */
    limit?: number
  }

  /**
   * LysmaExpense upsert
   */
  export type LysmaExpenseUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LysmaExpense
     */
    select?: LysmaExpenseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LysmaExpense
     */
    omit?: LysmaExpenseOmit<ExtArgs> | null
    /**
     * The filter to search for the LysmaExpense to update in case it exists.
     */
    where: LysmaExpenseWhereUniqueInput
    /**
     * In case the LysmaExpense found by the `where` argument doesn't exist, create a new LysmaExpense with this data.
     */
    create: XOR<LysmaExpenseCreateInput, LysmaExpenseUncheckedCreateInput>
    /**
     * In case the LysmaExpense was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LysmaExpenseUpdateInput, LysmaExpenseUncheckedUpdateInput>
  }

  /**
   * LysmaExpense delete
   */
  export type LysmaExpenseDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LysmaExpense
     */
    select?: LysmaExpenseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LysmaExpense
     */
    omit?: LysmaExpenseOmit<ExtArgs> | null
    /**
     * Filter which LysmaExpense to delete.
     */
    where: LysmaExpenseWhereUniqueInput
  }

  /**
   * LysmaExpense deleteMany
   */
  export type LysmaExpenseDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LysmaExpenses to delete
     */
    where?: LysmaExpenseWhereInput
    /**
     * Limit how many LysmaExpenses to delete.
     */
    limit?: number
  }

  /**
   * LysmaExpense without action
   */
  export type LysmaExpenseDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LysmaExpense
     */
    select?: LysmaExpenseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LysmaExpense
     */
    omit?: LysmaExpenseOmit<ExtArgs> | null
  }


  /**
   * Model RevenueSubscription
   */

  export type AggregateRevenueSubscription = {
    _count: RevenueSubscriptionCountAggregateOutputType | null
    _avg: RevenueSubscriptionAvgAggregateOutputType | null
    _sum: RevenueSubscriptionSumAggregateOutputType | null
    _min: RevenueSubscriptionMinAggregateOutputType | null
    _max: RevenueSubscriptionMaxAggregateOutputType | null
  }

  export type RevenueSubscriptionAvgAggregateOutputType = {
    amountHT: Decimal | null
    vatAmount: Decimal | null
    amountTTC: Decimal | null
  }

  export type RevenueSubscriptionSumAggregateOutputType = {
    amountHT: Decimal | null
    vatAmount: Decimal | null
    amountTTC: Decimal | null
  }

  export type RevenueSubscriptionMinAggregateOutputType = {
    id: string | null
    clientName: string | null
    clientCompany: string | null
    tool: $Enums.FinanceTool | null
    planName: string | null
    amountHT: Decimal | null
    vatAmount: Decimal | null
    amountTTC: Decimal | null
    frequency: $Enums.FinanceFrequency | null
    status: $Enums.RevenueStatus | null
    trialStartAt: Date | null
    trialEndAt: Date | null
    startDate: Date | null
    nextInvoiceAt: Date | null
    nextPaymentAt: Date | null
    gocardlessCustomerId: string | null
    gocardlessMandateId: string | null
    gocardlessSubscriptionId: string | null
    sageCustomerId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RevenueSubscriptionMaxAggregateOutputType = {
    id: string | null
    clientName: string | null
    clientCompany: string | null
    tool: $Enums.FinanceTool | null
    planName: string | null
    amountHT: Decimal | null
    vatAmount: Decimal | null
    amountTTC: Decimal | null
    frequency: $Enums.FinanceFrequency | null
    status: $Enums.RevenueStatus | null
    trialStartAt: Date | null
    trialEndAt: Date | null
    startDate: Date | null
    nextInvoiceAt: Date | null
    nextPaymentAt: Date | null
    gocardlessCustomerId: string | null
    gocardlessMandateId: string | null
    gocardlessSubscriptionId: string | null
    sageCustomerId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RevenueSubscriptionCountAggregateOutputType = {
    id: number
    clientName: number
    clientCompany: number
    tool: number
    planName: number
    amountHT: number
    vatAmount: number
    amountTTC: number
    frequency: number
    status: number
    trialStartAt: number
    trialEndAt: number
    startDate: number
    nextInvoiceAt: number
    nextPaymentAt: number
    gocardlessCustomerId: number
    gocardlessMandateId: number
    gocardlessSubscriptionId: number
    sageCustomerId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type RevenueSubscriptionAvgAggregateInputType = {
    amountHT?: true
    vatAmount?: true
    amountTTC?: true
  }

  export type RevenueSubscriptionSumAggregateInputType = {
    amountHT?: true
    vatAmount?: true
    amountTTC?: true
  }

  export type RevenueSubscriptionMinAggregateInputType = {
    id?: true
    clientName?: true
    clientCompany?: true
    tool?: true
    planName?: true
    amountHT?: true
    vatAmount?: true
    amountTTC?: true
    frequency?: true
    status?: true
    trialStartAt?: true
    trialEndAt?: true
    startDate?: true
    nextInvoiceAt?: true
    nextPaymentAt?: true
    gocardlessCustomerId?: true
    gocardlessMandateId?: true
    gocardlessSubscriptionId?: true
    sageCustomerId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RevenueSubscriptionMaxAggregateInputType = {
    id?: true
    clientName?: true
    clientCompany?: true
    tool?: true
    planName?: true
    amountHT?: true
    vatAmount?: true
    amountTTC?: true
    frequency?: true
    status?: true
    trialStartAt?: true
    trialEndAt?: true
    startDate?: true
    nextInvoiceAt?: true
    nextPaymentAt?: true
    gocardlessCustomerId?: true
    gocardlessMandateId?: true
    gocardlessSubscriptionId?: true
    sageCustomerId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RevenueSubscriptionCountAggregateInputType = {
    id?: true
    clientName?: true
    clientCompany?: true
    tool?: true
    planName?: true
    amountHT?: true
    vatAmount?: true
    amountTTC?: true
    frequency?: true
    status?: true
    trialStartAt?: true
    trialEndAt?: true
    startDate?: true
    nextInvoiceAt?: true
    nextPaymentAt?: true
    gocardlessCustomerId?: true
    gocardlessMandateId?: true
    gocardlessSubscriptionId?: true
    sageCustomerId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type RevenueSubscriptionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RevenueSubscription to aggregate.
     */
    where?: RevenueSubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RevenueSubscriptions to fetch.
     */
    orderBy?: RevenueSubscriptionOrderByWithRelationInput | RevenueSubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RevenueSubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RevenueSubscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RevenueSubscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RevenueSubscriptions
    **/
    _count?: true | RevenueSubscriptionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RevenueSubscriptionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RevenueSubscriptionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RevenueSubscriptionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RevenueSubscriptionMaxAggregateInputType
  }

  export type GetRevenueSubscriptionAggregateType<T extends RevenueSubscriptionAggregateArgs> = {
        [P in keyof T & keyof AggregateRevenueSubscription]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRevenueSubscription[P]>
      : GetScalarType<T[P], AggregateRevenueSubscription[P]>
  }




  export type RevenueSubscriptionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RevenueSubscriptionWhereInput
    orderBy?: RevenueSubscriptionOrderByWithAggregationInput | RevenueSubscriptionOrderByWithAggregationInput[]
    by: RevenueSubscriptionScalarFieldEnum[] | RevenueSubscriptionScalarFieldEnum
    having?: RevenueSubscriptionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RevenueSubscriptionCountAggregateInputType | true
    _avg?: RevenueSubscriptionAvgAggregateInputType
    _sum?: RevenueSubscriptionSumAggregateInputType
    _min?: RevenueSubscriptionMinAggregateInputType
    _max?: RevenueSubscriptionMaxAggregateInputType
  }

  export type RevenueSubscriptionGroupByOutputType = {
    id: string
    clientName: string
    clientCompany: string | null
    tool: $Enums.FinanceTool
    planName: string
    amountHT: Decimal
    vatAmount: Decimal
    amountTTC: Decimal
    frequency: $Enums.FinanceFrequency
    status: $Enums.RevenueStatus
    trialStartAt: Date | null
    trialEndAt: Date | null
    startDate: Date
    nextInvoiceAt: Date | null
    nextPaymentAt: Date | null
    gocardlessCustomerId: string | null
    gocardlessMandateId: string | null
    gocardlessSubscriptionId: string | null
    sageCustomerId: string | null
    createdAt: Date
    updatedAt: Date
    _count: RevenueSubscriptionCountAggregateOutputType | null
    _avg: RevenueSubscriptionAvgAggregateOutputType | null
    _sum: RevenueSubscriptionSumAggregateOutputType | null
    _min: RevenueSubscriptionMinAggregateOutputType | null
    _max: RevenueSubscriptionMaxAggregateOutputType | null
  }

  type GetRevenueSubscriptionGroupByPayload<T extends RevenueSubscriptionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RevenueSubscriptionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RevenueSubscriptionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RevenueSubscriptionGroupByOutputType[P]>
            : GetScalarType<T[P], RevenueSubscriptionGroupByOutputType[P]>
        }
      >
    >


  export type RevenueSubscriptionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    clientName?: boolean
    clientCompany?: boolean
    tool?: boolean
    planName?: boolean
    amountHT?: boolean
    vatAmount?: boolean
    amountTTC?: boolean
    frequency?: boolean
    status?: boolean
    trialStartAt?: boolean
    trialEndAt?: boolean
    startDate?: boolean
    nextInvoiceAt?: boolean
    nextPaymentAt?: boolean
    gocardlessCustomerId?: boolean
    gocardlessMandateId?: boolean
    gocardlessSubscriptionId?: boolean
    sageCustomerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    payments?: boolean | RevenueSubscription$paymentsArgs<ExtArgs>
    _count?: boolean | RevenueSubscriptionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["revenueSubscription"]>

  export type RevenueSubscriptionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    clientName?: boolean
    clientCompany?: boolean
    tool?: boolean
    planName?: boolean
    amountHT?: boolean
    vatAmount?: boolean
    amountTTC?: boolean
    frequency?: boolean
    status?: boolean
    trialStartAt?: boolean
    trialEndAt?: boolean
    startDate?: boolean
    nextInvoiceAt?: boolean
    nextPaymentAt?: boolean
    gocardlessCustomerId?: boolean
    gocardlessMandateId?: boolean
    gocardlessSubscriptionId?: boolean
    sageCustomerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["revenueSubscription"]>

  export type RevenueSubscriptionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    clientName?: boolean
    clientCompany?: boolean
    tool?: boolean
    planName?: boolean
    amountHT?: boolean
    vatAmount?: boolean
    amountTTC?: boolean
    frequency?: boolean
    status?: boolean
    trialStartAt?: boolean
    trialEndAt?: boolean
    startDate?: boolean
    nextInvoiceAt?: boolean
    nextPaymentAt?: boolean
    gocardlessCustomerId?: boolean
    gocardlessMandateId?: boolean
    gocardlessSubscriptionId?: boolean
    sageCustomerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["revenueSubscription"]>

  export type RevenueSubscriptionSelectScalar = {
    id?: boolean
    clientName?: boolean
    clientCompany?: boolean
    tool?: boolean
    planName?: boolean
    amountHT?: boolean
    vatAmount?: boolean
    amountTTC?: boolean
    frequency?: boolean
    status?: boolean
    trialStartAt?: boolean
    trialEndAt?: boolean
    startDate?: boolean
    nextInvoiceAt?: boolean
    nextPaymentAt?: boolean
    gocardlessCustomerId?: boolean
    gocardlessMandateId?: boolean
    gocardlessSubscriptionId?: boolean
    sageCustomerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type RevenueSubscriptionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "clientName" | "clientCompany" | "tool" | "planName" | "amountHT" | "vatAmount" | "amountTTC" | "frequency" | "status" | "trialStartAt" | "trialEndAt" | "startDate" | "nextInvoiceAt" | "nextPaymentAt" | "gocardlessCustomerId" | "gocardlessMandateId" | "gocardlessSubscriptionId" | "sageCustomerId" | "createdAt" | "updatedAt", ExtArgs["result"]["revenueSubscription"]>
  export type RevenueSubscriptionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    payments?: boolean | RevenueSubscription$paymentsArgs<ExtArgs>
    _count?: boolean | RevenueSubscriptionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type RevenueSubscriptionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type RevenueSubscriptionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $RevenueSubscriptionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RevenueSubscription"
    objects: {
      payments: Prisma.$FinancePaymentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      clientName: string
      clientCompany: string | null
      tool: $Enums.FinanceTool
      planName: string
      amountHT: Prisma.Decimal
      vatAmount: Prisma.Decimal
      amountTTC: Prisma.Decimal
      frequency: $Enums.FinanceFrequency
      status: $Enums.RevenueStatus
      trialStartAt: Date | null
      trialEndAt: Date | null
      startDate: Date
      nextInvoiceAt: Date | null
      nextPaymentAt: Date | null
      gocardlessCustomerId: string | null
      gocardlessMandateId: string | null
      gocardlessSubscriptionId: string | null
      sageCustomerId: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["revenueSubscription"]>
    composites: {}
  }

  type RevenueSubscriptionGetPayload<S extends boolean | null | undefined | RevenueSubscriptionDefaultArgs> = $Result.GetResult<Prisma.$RevenueSubscriptionPayload, S>

  type RevenueSubscriptionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RevenueSubscriptionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RevenueSubscriptionCountAggregateInputType | true
    }

  export interface RevenueSubscriptionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RevenueSubscription'], meta: { name: 'RevenueSubscription' } }
    /**
     * Find zero or one RevenueSubscription that matches the filter.
     * @param {RevenueSubscriptionFindUniqueArgs} args - Arguments to find a RevenueSubscription
     * @example
     * // Get one RevenueSubscription
     * const revenueSubscription = await prisma.revenueSubscription.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RevenueSubscriptionFindUniqueArgs>(args: SelectSubset<T, RevenueSubscriptionFindUniqueArgs<ExtArgs>>): Prisma__RevenueSubscriptionClient<$Result.GetResult<Prisma.$RevenueSubscriptionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RevenueSubscription that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RevenueSubscriptionFindUniqueOrThrowArgs} args - Arguments to find a RevenueSubscription
     * @example
     * // Get one RevenueSubscription
     * const revenueSubscription = await prisma.revenueSubscription.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RevenueSubscriptionFindUniqueOrThrowArgs>(args: SelectSubset<T, RevenueSubscriptionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RevenueSubscriptionClient<$Result.GetResult<Prisma.$RevenueSubscriptionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RevenueSubscription that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RevenueSubscriptionFindFirstArgs} args - Arguments to find a RevenueSubscription
     * @example
     * // Get one RevenueSubscription
     * const revenueSubscription = await prisma.revenueSubscription.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RevenueSubscriptionFindFirstArgs>(args?: SelectSubset<T, RevenueSubscriptionFindFirstArgs<ExtArgs>>): Prisma__RevenueSubscriptionClient<$Result.GetResult<Prisma.$RevenueSubscriptionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RevenueSubscription that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RevenueSubscriptionFindFirstOrThrowArgs} args - Arguments to find a RevenueSubscription
     * @example
     * // Get one RevenueSubscription
     * const revenueSubscription = await prisma.revenueSubscription.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RevenueSubscriptionFindFirstOrThrowArgs>(args?: SelectSubset<T, RevenueSubscriptionFindFirstOrThrowArgs<ExtArgs>>): Prisma__RevenueSubscriptionClient<$Result.GetResult<Prisma.$RevenueSubscriptionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RevenueSubscriptions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RevenueSubscriptionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RevenueSubscriptions
     * const revenueSubscriptions = await prisma.revenueSubscription.findMany()
     * 
     * // Get first 10 RevenueSubscriptions
     * const revenueSubscriptions = await prisma.revenueSubscription.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const revenueSubscriptionWithIdOnly = await prisma.revenueSubscription.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RevenueSubscriptionFindManyArgs>(args?: SelectSubset<T, RevenueSubscriptionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RevenueSubscriptionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RevenueSubscription.
     * @param {RevenueSubscriptionCreateArgs} args - Arguments to create a RevenueSubscription.
     * @example
     * // Create one RevenueSubscription
     * const RevenueSubscription = await prisma.revenueSubscription.create({
     *   data: {
     *     // ... data to create a RevenueSubscription
     *   }
     * })
     * 
     */
    create<T extends RevenueSubscriptionCreateArgs>(args: SelectSubset<T, RevenueSubscriptionCreateArgs<ExtArgs>>): Prisma__RevenueSubscriptionClient<$Result.GetResult<Prisma.$RevenueSubscriptionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RevenueSubscriptions.
     * @param {RevenueSubscriptionCreateManyArgs} args - Arguments to create many RevenueSubscriptions.
     * @example
     * // Create many RevenueSubscriptions
     * const revenueSubscription = await prisma.revenueSubscription.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RevenueSubscriptionCreateManyArgs>(args?: SelectSubset<T, RevenueSubscriptionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RevenueSubscriptions and returns the data saved in the database.
     * @param {RevenueSubscriptionCreateManyAndReturnArgs} args - Arguments to create many RevenueSubscriptions.
     * @example
     * // Create many RevenueSubscriptions
     * const revenueSubscription = await prisma.revenueSubscription.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RevenueSubscriptions and only return the `id`
     * const revenueSubscriptionWithIdOnly = await prisma.revenueSubscription.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RevenueSubscriptionCreateManyAndReturnArgs>(args?: SelectSubset<T, RevenueSubscriptionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RevenueSubscriptionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a RevenueSubscription.
     * @param {RevenueSubscriptionDeleteArgs} args - Arguments to delete one RevenueSubscription.
     * @example
     * // Delete one RevenueSubscription
     * const RevenueSubscription = await prisma.revenueSubscription.delete({
     *   where: {
     *     // ... filter to delete one RevenueSubscription
     *   }
     * })
     * 
     */
    delete<T extends RevenueSubscriptionDeleteArgs>(args: SelectSubset<T, RevenueSubscriptionDeleteArgs<ExtArgs>>): Prisma__RevenueSubscriptionClient<$Result.GetResult<Prisma.$RevenueSubscriptionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RevenueSubscription.
     * @param {RevenueSubscriptionUpdateArgs} args - Arguments to update one RevenueSubscription.
     * @example
     * // Update one RevenueSubscription
     * const revenueSubscription = await prisma.revenueSubscription.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RevenueSubscriptionUpdateArgs>(args: SelectSubset<T, RevenueSubscriptionUpdateArgs<ExtArgs>>): Prisma__RevenueSubscriptionClient<$Result.GetResult<Prisma.$RevenueSubscriptionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RevenueSubscriptions.
     * @param {RevenueSubscriptionDeleteManyArgs} args - Arguments to filter RevenueSubscriptions to delete.
     * @example
     * // Delete a few RevenueSubscriptions
     * const { count } = await prisma.revenueSubscription.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RevenueSubscriptionDeleteManyArgs>(args?: SelectSubset<T, RevenueSubscriptionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RevenueSubscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RevenueSubscriptionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RevenueSubscriptions
     * const revenueSubscription = await prisma.revenueSubscription.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RevenueSubscriptionUpdateManyArgs>(args: SelectSubset<T, RevenueSubscriptionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RevenueSubscriptions and returns the data updated in the database.
     * @param {RevenueSubscriptionUpdateManyAndReturnArgs} args - Arguments to update many RevenueSubscriptions.
     * @example
     * // Update many RevenueSubscriptions
     * const revenueSubscription = await prisma.revenueSubscription.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more RevenueSubscriptions and only return the `id`
     * const revenueSubscriptionWithIdOnly = await prisma.revenueSubscription.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RevenueSubscriptionUpdateManyAndReturnArgs>(args: SelectSubset<T, RevenueSubscriptionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RevenueSubscriptionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one RevenueSubscription.
     * @param {RevenueSubscriptionUpsertArgs} args - Arguments to update or create a RevenueSubscription.
     * @example
     * // Update or create a RevenueSubscription
     * const revenueSubscription = await prisma.revenueSubscription.upsert({
     *   create: {
     *     // ... data to create a RevenueSubscription
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RevenueSubscription we want to update
     *   }
     * })
     */
    upsert<T extends RevenueSubscriptionUpsertArgs>(args: SelectSubset<T, RevenueSubscriptionUpsertArgs<ExtArgs>>): Prisma__RevenueSubscriptionClient<$Result.GetResult<Prisma.$RevenueSubscriptionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RevenueSubscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RevenueSubscriptionCountArgs} args - Arguments to filter RevenueSubscriptions to count.
     * @example
     * // Count the number of RevenueSubscriptions
     * const count = await prisma.revenueSubscription.count({
     *   where: {
     *     // ... the filter for the RevenueSubscriptions we want to count
     *   }
     * })
    **/
    count<T extends RevenueSubscriptionCountArgs>(
      args?: Subset<T, RevenueSubscriptionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RevenueSubscriptionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RevenueSubscription.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RevenueSubscriptionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RevenueSubscriptionAggregateArgs>(args: Subset<T, RevenueSubscriptionAggregateArgs>): Prisma.PrismaPromise<GetRevenueSubscriptionAggregateType<T>>

    /**
     * Group by RevenueSubscription.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RevenueSubscriptionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RevenueSubscriptionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RevenueSubscriptionGroupByArgs['orderBy'] }
        : { orderBy?: RevenueSubscriptionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RevenueSubscriptionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRevenueSubscriptionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RevenueSubscription model
   */
  readonly fields: RevenueSubscriptionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RevenueSubscription.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RevenueSubscriptionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    payments<T extends RevenueSubscription$paymentsArgs<ExtArgs> = {}>(args?: Subset<T, RevenueSubscription$paymentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FinancePaymentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RevenueSubscription model
   */
  interface RevenueSubscriptionFieldRefs {
    readonly id: FieldRef<"RevenueSubscription", 'String'>
    readonly clientName: FieldRef<"RevenueSubscription", 'String'>
    readonly clientCompany: FieldRef<"RevenueSubscription", 'String'>
    readonly tool: FieldRef<"RevenueSubscription", 'FinanceTool'>
    readonly planName: FieldRef<"RevenueSubscription", 'String'>
    readonly amountHT: FieldRef<"RevenueSubscription", 'Decimal'>
    readonly vatAmount: FieldRef<"RevenueSubscription", 'Decimal'>
    readonly amountTTC: FieldRef<"RevenueSubscription", 'Decimal'>
    readonly frequency: FieldRef<"RevenueSubscription", 'FinanceFrequency'>
    readonly status: FieldRef<"RevenueSubscription", 'RevenueStatus'>
    readonly trialStartAt: FieldRef<"RevenueSubscription", 'DateTime'>
    readonly trialEndAt: FieldRef<"RevenueSubscription", 'DateTime'>
    readonly startDate: FieldRef<"RevenueSubscription", 'DateTime'>
    readonly nextInvoiceAt: FieldRef<"RevenueSubscription", 'DateTime'>
    readonly nextPaymentAt: FieldRef<"RevenueSubscription", 'DateTime'>
    readonly gocardlessCustomerId: FieldRef<"RevenueSubscription", 'String'>
    readonly gocardlessMandateId: FieldRef<"RevenueSubscription", 'String'>
    readonly gocardlessSubscriptionId: FieldRef<"RevenueSubscription", 'String'>
    readonly sageCustomerId: FieldRef<"RevenueSubscription", 'String'>
    readonly createdAt: FieldRef<"RevenueSubscription", 'DateTime'>
    readonly updatedAt: FieldRef<"RevenueSubscription", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RevenueSubscription findUnique
   */
  export type RevenueSubscriptionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RevenueSubscription
     */
    select?: RevenueSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RevenueSubscription
     */
    omit?: RevenueSubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RevenueSubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which RevenueSubscription to fetch.
     */
    where: RevenueSubscriptionWhereUniqueInput
  }

  /**
   * RevenueSubscription findUniqueOrThrow
   */
  export type RevenueSubscriptionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RevenueSubscription
     */
    select?: RevenueSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RevenueSubscription
     */
    omit?: RevenueSubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RevenueSubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which RevenueSubscription to fetch.
     */
    where: RevenueSubscriptionWhereUniqueInput
  }

  /**
   * RevenueSubscription findFirst
   */
  export type RevenueSubscriptionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RevenueSubscription
     */
    select?: RevenueSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RevenueSubscription
     */
    omit?: RevenueSubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RevenueSubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which RevenueSubscription to fetch.
     */
    where?: RevenueSubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RevenueSubscriptions to fetch.
     */
    orderBy?: RevenueSubscriptionOrderByWithRelationInput | RevenueSubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RevenueSubscriptions.
     */
    cursor?: RevenueSubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RevenueSubscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RevenueSubscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RevenueSubscriptions.
     */
    distinct?: RevenueSubscriptionScalarFieldEnum | RevenueSubscriptionScalarFieldEnum[]
  }

  /**
   * RevenueSubscription findFirstOrThrow
   */
  export type RevenueSubscriptionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RevenueSubscription
     */
    select?: RevenueSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RevenueSubscription
     */
    omit?: RevenueSubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RevenueSubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which RevenueSubscription to fetch.
     */
    where?: RevenueSubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RevenueSubscriptions to fetch.
     */
    orderBy?: RevenueSubscriptionOrderByWithRelationInput | RevenueSubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RevenueSubscriptions.
     */
    cursor?: RevenueSubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RevenueSubscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RevenueSubscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RevenueSubscriptions.
     */
    distinct?: RevenueSubscriptionScalarFieldEnum | RevenueSubscriptionScalarFieldEnum[]
  }

  /**
   * RevenueSubscription findMany
   */
  export type RevenueSubscriptionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RevenueSubscription
     */
    select?: RevenueSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RevenueSubscription
     */
    omit?: RevenueSubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RevenueSubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which RevenueSubscriptions to fetch.
     */
    where?: RevenueSubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RevenueSubscriptions to fetch.
     */
    orderBy?: RevenueSubscriptionOrderByWithRelationInput | RevenueSubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RevenueSubscriptions.
     */
    cursor?: RevenueSubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RevenueSubscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RevenueSubscriptions.
     */
    skip?: number
    distinct?: RevenueSubscriptionScalarFieldEnum | RevenueSubscriptionScalarFieldEnum[]
  }

  /**
   * RevenueSubscription create
   */
  export type RevenueSubscriptionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RevenueSubscription
     */
    select?: RevenueSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RevenueSubscription
     */
    omit?: RevenueSubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RevenueSubscriptionInclude<ExtArgs> | null
    /**
     * The data needed to create a RevenueSubscription.
     */
    data: XOR<RevenueSubscriptionCreateInput, RevenueSubscriptionUncheckedCreateInput>
  }

  /**
   * RevenueSubscription createMany
   */
  export type RevenueSubscriptionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RevenueSubscriptions.
     */
    data: RevenueSubscriptionCreateManyInput | RevenueSubscriptionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RevenueSubscription createManyAndReturn
   */
  export type RevenueSubscriptionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RevenueSubscription
     */
    select?: RevenueSubscriptionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RevenueSubscription
     */
    omit?: RevenueSubscriptionOmit<ExtArgs> | null
    /**
     * The data used to create many RevenueSubscriptions.
     */
    data: RevenueSubscriptionCreateManyInput | RevenueSubscriptionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RevenueSubscription update
   */
  export type RevenueSubscriptionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RevenueSubscription
     */
    select?: RevenueSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RevenueSubscription
     */
    omit?: RevenueSubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RevenueSubscriptionInclude<ExtArgs> | null
    /**
     * The data needed to update a RevenueSubscription.
     */
    data: XOR<RevenueSubscriptionUpdateInput, RevenueSubscriptionUncheckedUpdateInput>
    /**
     * Choose, which RevenueSubscription to update.
     */
    where: RevenueSubscriptionWhereUniqueInput
  }

  /**
   * RevenueSubscription updateMany
   */
  export type RevenueSubscriptionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RevenueSubscriptions.
     */
    data: XOR<RevenueSubscriptionUpdateManyMutationInput, RevenueSubscriptionUncheckedUpdateManyInput>
    /**
     * Filter which RevenueSubscriptions to update
     */
    where?: RevenueSubscriptionWhereInput
    /**
     * Limit how many RevenueSubscriptions to update.
     */
    limit?: number
  }

  /**
   * RevenueSubscription updateManyAndReturn
   */
  export type RevenueSubscriptionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RevenueSubscription
     */
    select?: RevenueSubscriptionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RevenueSubscription
     */
    omit?: RevenueSubscriptionOmit<ExtArgs> | null
    /**
     * The data used to update RevenueSubscriptions.
     */
    data: XOR<RevenueSubscriptionUpdateManyMutationInput, RevenueSubscriptionUncheckedUpdateManyInput>
    /**
     * Filter which RevenueSubscriptions to update
     */
    where?: RevenueSubscriptionWhereInput
    /**
     * Limit how many RevenueSubscriptions to update.
     */
    limit?: number
  }

  /**
   * RevenueSubscription upsert
   */
  export type RevenueSubscriptionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RevenueSubscription
     */
    select?: RevenueSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RevenueSubscription
     */
    omit?: RevenueSubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RevenueSubscriptionInclude<ExtArgs> | null
    /**
     * The filter to search for the RevenueSubscription to update in case it exists.
     */
    where: RevenueSubscriptionWhereUniqueInput
    /**
     * In case the RevenueSubscription found by the `where` argument doesn't exist, create a new RevenueSubscription with this data.
     */
    create: XOR<RevenueSubscriptionCreateInput, RevenueSubscriptionUncheckedCreateInput>
    /**
     * In case the RevenueSubscription was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RevenueSubscriptionUpdateInput, RevenueSubscriptionUncheckedUpdateInput>
  }

  /**
   * RevenueSubscription delete
   */
  export type RevenueSubscriptionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RevenueSubscription
     */
    select?: RevenueSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RevenueSubscription
     */
    omit?: RevenueSubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RevenueSubscriptionInclude<ExtArgs> | null
    /**
     * Filter which RevenueSubscription to delete.
     */
    where: RevenueSubscriptionWhereUniqueInput
  }

  /**
   * RevenueSubscription deleteMany
   */
  export type RevenueSubscriptionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RevenueSubscriptions to delete
     */
    where?: RevenueSubscriptionWhereInput
    /**
     * Limit how many RevenueSubscriptions to delete.
     */
    limit?: number
  }

  /**
   * RevenueSubscription.payments
   */
  export type RevenueSubscription$paymentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FinancePayment
     */
    select?: FinancePaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FinancePayment
     */
    omit?: FinancePaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FinancePaymentInclude<ExtArgs> | null
    where?: FinancePaymentWhereInput
    orderBy?: FinancePaymentOrderByWithRelationInput | FinancePaymentOrderByWithRelationInput[]
    cursor?: FinancePaymentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FinancePaymentScalarFieldEnum | FinancePaymentScalarFieldEnum[]
  }

  /**
   * RevenueSubscription without action
   */
  export type RevenueSubscriptionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RevenueSubscription
     */
    select?: RevenueSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RevenueSubscription
     */
    omit?: RevenueSubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RevenueSubscriptionInclude<ExtArgs> | null
  }


  /**
   * Model FinanceInvoice
   */

  export type AggregateFinanceInvoice = {
    _count: FinanceInvoiceCountAggregateOutputType | null
    _avg: FinanceInvoiceAvgAggregateOutputType | null
    _sum: FinanceInvoiceSumAggregateOutputType | null
    _min: FinanceInvoiceMinAggregateOutputType | null
    _max: FinanceInvoiceMaxAggregateOutputType | null
  }

  export type FinanceInvoiceAvgAggregateOutputType = {
    amountHT: Decimal | null
    vatAmount: Decimal | null
    amountTTC: Decimal | null
  }

  export type FinanceInvoiceSumAggregateOutputType = {
    amountHT: Decimal | null
    vatAmount: Decimal | null
    amountTTC: Decimal | null
  }

  export type FinanceInvoiceMinAggregateOutputType = {
    id: string | null
    invoiceNumber: string | null
    clientName: string | null
    clientCompany: string | null
    tool: $Enums.FinanceTool | null
    amountHT: Decimal | null
    vatAmount: Decimal | null
    amountTTC: Decimal | null
    status: $Enums.FinanceInvoiceStatus | null
    issueDate: Date | null
    dueDate: Date | null
    paidAt: Date | null
    pdfUrl: string | null
    sageInvoiceId: string | null
    sageInvoiceStatus: string | null
    electronicInvoiceStatus: $Enums.ElectronicInvoiceStatus | null
    platformProvider: string | null
    platformInvoiceId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FinanceInvoiceMaxAggregateOutputType = {
    id: string | null
    invoiceNumber: string | null
    clientName: string | null
    clientCompany: string | null
    tool: $Enums.FinanceTool | null
    amountHT: Decimal | null
    vatAmount: Decimal | null
    amountTTC: Decimal | null
    status: $Enums.FinanceInvoiceStatus | null
    issueDate: Date | null
    dueDate: Date | null
    paidAt: Date | null
    pdfUrl: string | null
    sageInvoiceId: string | null
    sageInvoiceStatus: string | null
    electronicInvoiceStatus: $Enums.ElectronicInvoiceStatus | null
    platformProvider: string | null
    platformInvoiceId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FinanceInvoiceCountAggregateOutputType = {
    id: number
    invoiceNumber: number
    clientName: number
    clientCompany: number
    tool: number
    amountHT: number
    vatAmount: number
    amountTTC: number
    status: number
    issueDate: number
    dueDate: number
    paidAt: number
    pdfUrl: number
    sageInvoiceId: number
    sageInvoiceStatus: number
    electronicInvoiceStatus: number
    platformProvider: number
    platformInvoiceId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type FinanceInvoiceAvgAggregateInputType = {
    amountHT?: true
    vatAmount?: true
    amountTTC?: true
  }

  export type FinanceInvoiceSumAggregateInputType = {
    amountHT?: true
    vatAmount?: true
    amountTTC?: true
  }

  export type FinanceInvoiceMinAggregateInputType = {
    id?: true
    invoiceNumber?: true
    clientName?: true
    clientCompany?: true
    tool?: true
    amountHT?: true
    vatAmount?: true
    amountTTC?: true
    status?: true
    issueDate?: true
    dueDate?: true
    paidAt?: true
    pdfUrl?: true
    sageInvoiceId?: true
    sageInvoiceStatus?: true
    electronicInvoiceStatus?: true
    platformProvider?: true
    platformInvoiceId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FinanceInvoiceMaxAggregateInputType = {
    id?: true
    invoiceNumber?: true
    clientName?: true
    clientCompany?: true
    tool?: true
    amountHT?: true
    vatAmount?: true
    amountTTC?: true
    status?: true
    issueDate?: true
    dueDate?: true
    paidAt?: true
    pdfUrl?: true
    sageInvoiceId?: true
    sageInvoiceStatus?: true
    electronicInvoiceStatus?: true
    platformProvider?: true
    platformInvoiceId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FinanceInvoiceCountAggregateInputType = {
    id?: true
    invoiceNumber?: true
    clientName?: true
    clientCompany?: true
    tool?: true
    amountHT?: true
    vatAmount?: true
    amountTTC?: true
    status?: true
    issueDate?: true
    dueDate?: true
    paidAt?: true
    pdfUrl?: true
    sageInvoiceId?: true
    sageInvoiceStatus?: true
    electronicInvoiceStatus?: true
    platformProvider?: true
    platformInvoiceId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type FinanceInvoiceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FinanceInvoice to aggregate.
     */
    where?: FinanceInvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FinanceInvoices to fetch.
     */
    orderBy?: FinanceInvoiceOrderByWithRelationInput | FinanceInvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FinanceInvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FinanceInvoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FinanceInvoices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned FinanceInvoices
    **/
    _count?: true | FinanceInvoiceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FinanceInvoiceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FinanceInvoiceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FinanceInvoiceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FinanceInvoiceMaxAggregateInputType
  }

  export type GetFinanceInvoiceAggregateType<T extends FinanceInvoiceAggregateArgs> = {
        [P in keyof T & keyof AggregateFinanceInvoice]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFinanceInvoice[P]>
      : GetScalarType<T[P], AggregateFinanceInvoice[P]>
  }




  export type FinanceInvoiceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FinanceInvoiceWhereInput
    orderBy?: FinanceInvoiceOrderByWithAggregationInput | FinanceInvoiceOrderByWithAggregationInput[]
    by: FinanceInvoiceScalarFieldEnum[] | FinanceInvoiceScalarFieldEnum
    having?: FinanceInvoiceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FinanceInvoiceCountAggregateInputType | true
    _avg?: FinanceInvoiceAvgAggregateInputType
    _sum?: FinanceInvoiceSumAggregateInputType
    _min?: FinanceInvoiceMinAggregateInputType
    _max?: FinanceInvoiceMaxAggregateInputType
  }

  export type FinanceInvoiceGroupByOutputType = {
    id: string
    invoiceNumber: string
    clientName: string
    clientCompany: string | null
    tool: $Enums.FinanceTool
    amountHT: Decimal
    vatAmount: Decimal
    amountTTC: Decimal
    status: $Enums.FinanceInvoiceStatus
    issueDate: Date
    dueDate: Date | null
    paidAt: Date | null
    pdfUrl: string | null
    sageInvoiceId: string | null
    sageInvoiceStatus: string | null
    electronicInvoiceStatus: $Enums.ElectronicInvoiceStatus
    platformProvider: string | null
    platformInvoiceId: string | null
    createdAt: Date
    updatedAt: Date
    _count: FinanceInvoiceCountAggregateOutputType | null
    _avg: FinanceInvoiceAvgAggregateOutputType | null
    _sum: FinanceInvoiceSumAggregateOutputType | null
    _min: FinanceInvoiceMinAggregateOutputType | null
    _max: FinanceInvoiceMaxAggregateOutputType | null
  }

  type GetFinanceInvoiceGroupByPayload<T extends FinanceInvoiceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FinanceInvoiceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FinanceInvoiceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FinanceInvoiceGroupByOutputType[P]>
            : GetScalarType<T[P], FinanceInvoiceGroupByOutputType[P]>
        }
      >
    >


  export type FinanceInvoiceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    invoiceNumber?: boolean
    clientName?: boolean
    clientCompany?: boolean
    tool?: boolean
    amountHT?: boolean
    vatAmount?: boolean
    amountTTC?: boolean
    status?: boolean
    issueDate?: boolean
    dueDate?: boolean
    paidAt?: boolean
    pdfUrl?: boolean
    sageInvoiceId?: boolean
    sageInvoiceStatus?: boolean
    electronicInvoiceStatus?: boolean
    platformProvider?: boolean
    platformInvoiceId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    payments?: boolean | FinanceInvoice$paymentsArgs<ExtArgs>
    _count?: boolean | FinanceInvoiceCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["financeInvoice"]>

  export type FinanceInvoiceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    invoiceNumber?: boolean
    clientName?: boolean
    clientCompany?: boolean
    tool?: boolean
    amountHT?: boolean
    vatAmount?: boolean
    amountTTC?: boolean
    status?: boolean
    issueDate?: boolean
    dueDate?: boolean
    paidAt?: boolean
    pdfUrl?: boolean
    sageInvoiceId?: boolean
    sageInvoiceStatus?: boolean
    electronicInvoiceStatus?: boolean
    platformProvider?: boolean
    platformInvoiceId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["financeInvoice"]>

  export type FinanceInvoiceSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    invoiceNumber?: boolean
    clientName?: boolean
    clientCompany?: boolean
    tool?: boolean
    amountHT?: boolean
    vatAmount?: boolean
    amountTTC?: boolean
    status?: boolean
    issueDate?: boolean
    dueDate?: boolean
    paidAt?: boolean
    pdfUrl?: boolean
    sageInvoiceId?: boolean
    sageInvoiceStatus?: boolean
    electronicInvoiceStatus?: boolean
    platformProvider?: boolean
    platformInvoiceId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["financeInvoice"]>

  export type FinanceInvoiceSelectScalar = {
    id?: boolean
    invoiceNumber?: boolean
    clientName?: boolean
    clientCompany?: boolean
    tool?: boolean
    amountHT?: boolean
    vatAmount?: boolean
    amountTTC?: boolean
    status?: boolean
    issueDate?: boolean
    dueDate?: boolean
    paidAt?: boolean
    pdfUrl?: boolean
    sageInvoiceId?: boolean
    sageInvoiceStatus?: boolean
    electronicInvoiceStatus?: boolean
    platformProvider?: boolean
    platformInvoiceId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type FinanceInvoiceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "invoiceNumber" | "clientName" | "clientCompany" | "tool" | "amountHT" | "vatAmount" | "amountTTC" | "status" | "issueDate" | "dueDate" | "paidAt" | "pdfUrl" | "sageInvoiceId" | "sageInvoiceStatus" | "electronicInvoiceStatus" | "platformProvider" | "platformInvoiceId" | "createdAt" | "updatedAt", ExtArgs["result"]["financeInvoice"]>
  export type FinanceInvoiceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    payments?: boolean | FinanceInvoice$paymentsArgs<ExtArgs>
    _count?: boolean | FinanceInvoiceCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type FinanceInvoiceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type FinanceInvoiceIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $FinanceInvoicePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "FinanceInvoice"
    objects: {
      payments: Prisma.$FinancePaymentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      invoiceNumber: string
      clientName: string
      clientCompany: string | null
      tool: $Enums.FinanceTool
      amountHT: Prisma.Decimal
      vatAmount: Prisma.Decimal
      amountTTC: Prisma.Decimal
      status: $Enums.FinanceInvoiceStatus
      issueDate: Date
      dueDate: Date | null
      paidAt: Date | null
      pdfUrl: string | null
      sageInvoiceId: string | null
      sageInvoiceStatus: string | null
      electronicInvoiceStatus: $Enums.ElectronicInvoiceStatus
      platformProvider: string | null
      platformInvoiceId: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["financeInvoice"]>
    composites: {}
  }

  type FinanceInvoiceGetPayload<S extends boolean | null | undefined | FinanceInvoiceDefaultArgs> = $Result.GetResult<Prisma.$FinanceInvoicePayload, S>

  type FinanceInvoiceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FinanceInvoiceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FinanceInvoiceCountAggregateInputType | true
    }

  export interface FinanceInvoiceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['FinanceInvoice'], meta: { name: 'FinanceInvoice' } }
    /**
     * Find zero or one FinanceInvoice that matches the filter.
     * @param {FinanceInvoiceFindUniqueArgs} args - Arguments to find a FinanceInvoice
     * @example
     * // Get one FinanceInvoice
     * const financeInvoice = await prisma.financeInvoice.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FinanceInvoiceFindUniqueArgs>(args: SelectSubset<T, FinanceInvoiceFindUniqueArgs<ExtArgs>>): Prisma__FinanceInvoiceClient<$Result.GetResult<Prisma.$FinanceInvoicePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one FinanceInvoice that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FinanceInvoiceFindUniqueOrThrowArgs} args - Arguments to find a FinanceInvoice
     * @example
     * // Get one FinanceInvoice
     * const financeInvoice = await prisma.financeInvoice.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FinanceInvoiceFindUniqueOrThrowArgs>(args: SelectSubset<T, FinanceInvoiceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FinanceInvoiceClient<$Result.GetResult<Prisma.$FinanceInvoicePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FinanceInvoice that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FinanceInvoiceFindFirstArgs} args - Arguments to find a FinanceInvoice
     * @example
     * // Get one FinanceInvoice
     * const financeInvoice = await prisma.financeInvoice.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FinanceInvoiceFindFirstArgs>(args?: SelectSubset<T, FinanceInvoiceFindFirstArgs<ExtArgs>>): Prisma__FinanceInvoiceClient<$Result.GetResult<Prisma.$FinanceInvoicePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FinanceInvoice that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FinanceInvoiceFindFirstOrThrowArgs} args - Arguments to find a FinanceInvoice
     * @example
     * // Get one FinanceInvoice
     * const financeInvoice = await prisma.financeInvoice.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FinanceInvoiceFindFirstOrThrowArgs>(args?: SelectSubset<T, FinanceInvoiceFindFirstOrThrowArgs<ExtArgs>>): Prisma__FinanceInvoiceClient<$Result.GetResult<Prisma.$FinanceInvoicePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more FinanceInvoices that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FinanceInvoiceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FinanceInvoices
     * const financeInvoices = await prisma.financeInvoice.findMany()
     * 
     * // Get first 10 FinanceInvoices
     * const financeInvoices = await prisma.financeInvoice.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const financeInvoiceWithIdOnly = await prisma.financeInvoice.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FinanceInvoiceFindManyArgs>(args?: SelectSubset<T, FinanceInvoiceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FinanceInvoicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a FinanceInvoice.
     * @param {FinanceInvoiceCreateArgs} args - Arguments to create a FinanceInvoice.
     * @example
     * // Create one FinanceInvoice
     * const FinanceInvoice = await prisma.financeInvoice.create({
     *   data: {
     *     // ... data to create a FinanceInvoice
     *   }
     * })
     * 
     */
    create<T extends FinanceInvoiceCreateArgs>(args: SelectSubset<T, FinanceInvoiceCreateArgs<ExtArgs>>): Prisma__FinanceInvoiceClient<$Result.GetResult<Prisma.$FinanceInvoicePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many FinanceInvoices.
     * @param {FinanceInvoiceCreateManyArgs} args - Arguments to create many FinanceInvoices.
     * @example
     * // Create many FinanceInvoices
     * const financeInvoice = await prisma.financeInvoice.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FinanceInvoiceCreateManyArgs>(args?: SelectSubset<T, FinanceInvoiceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many FinanceInvoices and returns the data saved in the database.
     * @param {FinanceInvoiceCreateManyAndReturnArgs} args - Arguments to create many FinanceInvoices.
     * @example
     * // Create many FinanceInvoices
     * const financeInvoice = await prisma.financeInvoice.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many FinanceInvoices and only return the `id`
     * const financeInvoiceWithIdOnly = await prisma.financeInvoice.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FinanceInvoiceCreateManyAndReturnArgs>(args?: SelectSubset<T, FinanceInvoiceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FinanceInvoicePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a FinanceInvoice.
     * @param {FinanceInvoiceDeleteArgs} args - Arguments to delete one FinanceInvoice.
     * @example
     * // Delete one FinanceInvoice
     * const FinanceInvoice = await prisma.financeInvoice.delete({
     *   where: {
     *     // ... filter to delete one FinanceInvoice
     *   }
     * })
     * 
     */
    delete<T extends FinanceInvoiceDeleteArgs>(args: SelectSubset<T, FinanceInvoiceDeleteArgs<ExtArgs>>): Prisma__FinanceInvoiceClient<$Result.GetResult<Prisma.$FinanceInvoicePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one FinanceInvoice.
     * @param {FinanceInvoiceUpdateArgs} args - Arguments to update one FinanceInvoice.
     * @example
     * // Update one FinanceInvoice
     * const financeInvoice = await prisma.financeInvoice.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FinanceInvoiceUpdateArgs>(args: SelectSubset<T, FinanceInvoiceUpdateArgs<ExtArgs>>): Prisma__FinanceInvoiceClient<$Result.GetResult<Prisma.$FinanceInvoicePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more FinanceInvoices.
     * @param {FinanceInvoiceDeleteManyArgs} args - Arguments to filter FinanceInvoices to delete.
     * @example
     * // Delete a few FinanceInvoices
     * const { count } = await prisma.financeInvoice.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FinanceInvoiceDeleteManyArgs>(args?: SelectSubset<T, FinanceInvoiceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FinanceInvoices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FinanceInvoiceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FinanceInvoices
     * const financeInvoice = await prisma.financeInvoice.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FinanceInvoiceUpdateManyArgs>(args: SelectSubset<T, FinanceInvoiceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FinanceInvoices and returns the data updated in the database.
     * @param {FinanceInvoiceUpdateManyAndReturnArgs} args - Arguments to update many FinanceInvoices.
     * @example
     * // Update many FinanceInvoices
     * const financeInvoice = await prisma.financeInvoice.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more FinanceInvoices and only return the `id`
     * const financeInvoiceWithIdOnly = await prisma.financeInvoice.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends FinanceInvoiceUpdateManyAndReturnArgs>(args: SelectSubset<T, FinanceInvoiceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FinanceInvoicePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one FinanceInvoice.
     * @param {FinanceInvoiceUpsertArgs} args - Arguments to update or create a FinanceInvoice.
     * @example
     * // Update or create a FinanceInvoice
     * const financeInvoice = await prisma.financeInvoice.upsert({
     *   create: {
     *     // ... data to create a FinanceInvoice
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FinanceInvoice we want to update
     *   }
     * })
     */
    upsert<T extends FinanceInvoiceUpsertArgs>(args: SelectSubset<T, FinanceInvoiceUpsertArgs<ExtArgs>>): Prisma__FinanceInvoiceClient<$Result.GetResult<Prisma.$FinanceInvoicePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of FinanceInvoices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FinanceInvoiceCountArgs} args - Arguments to filter FinanceInvoices to count.
     * @example
     * // Count the number of FinanceInvoices
     * const count = await prisma.financeInvoice.count({
     *   where: {
     *     // ... the filter for the FinanceInvoices we want to count
     *   }
     * })
    **/
    count<T extends FinanceInvoiceCountArgs>(
      args?: Subset<T, FinanceInvoiceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FinanceInvoiceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a FinanceInvoice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FinanceInvoiceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FinanceInvoiceAggregateArgs>(args: Subset<T, FinanceInvoiceAggregateArgs>): Prisma.PrismaPromise<GetFinanceInvoiceAggregateType<T>>

    /**
     * Group by FinanceInvoice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FinanceInvoiceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FinanceInvoiceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FinanceInvoiceGroupByArgs['orderBy'] }
        : { orderBy?: FinanceInvoiceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FinanceInvoiceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFinanceInvoiceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the FinanceInvoice model
   */
  readonly fields: FinanceInvoiceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for FinanceInvoice.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FinanceInvoiceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    payments<T extends FinanceInvoice$paymentsArgs<ExtArgs> = {}>(args?: Subset<T, FinanceInvoice$paymentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FinancePaymentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the FinanceInvoice model
   */
  interface FinanceInvoiceFieldRefs {
    readonly id: FieldRef<"FinanceInvoice", 'String'>
    readonly invoiceNumber: FieldRef<"FinanceInvoice", 'String'>
    readonly clientName: FieldRef<"FinanceInvoice", 'String'>
    readonly clientCompany: FieldRef<"FinanceInvoice", 'String'>
    readonly tool: FieldRef<"FinanceInvoice", 'FinanceTool'>
    readonly amountHT: FieldRef<"FinanceInvoice", 'Decimal'>
    readonly vatAmount: FieldRef<"FinanceInvoice", 'Decimal'>
    readonly amountTTC: FieldRef<"FinanceInvoice", 'Decimal'>
    readonly status: FieldRef<"FinanceInvoice", 'FinanceInvoiceStatus'>
    readonly issueDate: FieldRef<"FinanceInvoice", 'DateTime'>
    readonly dueDate: FieldRef<"FinanceInvoice", 'DateTime'>
    readonly paidAt: FieldRef<"FinanceInvoice", 'DateTime'>
    readonly pdfUrl: FieldRef<"FinanceInvoice", 'String'>
    readonly sageInvoiceId: FieldRef<"FinanceInvoice", 'String'>
    readonly sageInvoiceStatus: FieldRef<"FinanceInvoice", 'String'>
    readonly electronicInvoiceStatus: FieldRef<"FinanceInvoice", 'ElectronicInvoiceStatus'>
    readonly platformProvider: FieldRef<"FinanceInvoice", 'String'>
    readonly platformInvoiceId: FieldRef<"FinanceInvoice", 'String'>
    readonly createdAt: FieldRef<"FinanceInvoice", 'DateTime'>
    readonly updatedAt: FieldRef<"FinanceInvoice", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * FinanceInvoice findUnique
   */
  export type FinanceInvoiceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FinanceInvoice
     */
    select?: FinanceInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FinanceInvoice
     */
    omit?: FinanceInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FinanceInvoiceInclude<ExtArgs> | null
    /**
     * Filter, which FinanceInvoice to fetch.
     */
    where: FinanceInvoiceWhereUniqueInput
  }

  /**
   * FinanceInvoice findUniqueOrThrow
   */
  export type FinanceInvoiceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FinanceInvoice
     */
    select?: FinanceInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FinanceInvoice
     */
    omit?: FinanceInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FinanceInvoiceInclude<ExtArgs> | null
    /**
     * Filter, which FinanceInvoice to fetch.
     */
    where: FinanceInvoiceWhereUniqueInput
  }

  /**
   * FinanceInvoice findFirst
   */
  export type FinanceInvoiceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FinanceInvoice
     */
    select?: FinanceInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FinanceInvoice
     */
    omit?: FinanceInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FinanceInvoiceInclude<ExtArgs> | null
    /**
     * Filter, which FinanceInvoice to fetch.
     */
    where?: FinanceInvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FinanceInvoices to fetch.
     */
    orderBy?: FinanceInvoiceOrderByWithRelationInput | FinanceInvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FinanceInvoices.
     */
    cursor?: FinanceInvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FinanceInvoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FinanceInvoices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FinanceInvoices.
     */
    distinct?: FinanceInvoiceScalarFieldEnum | FinanceInvoiceScalarFieldEnum[]
  }

  /**
   * FinanceInvoice findFirstOrThrow
   */
  export type FinanceInvoiceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FinanceInvoice
     */
    select?: FinanceInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FinanceInvoice
     */
    omit?: FinanceInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FinanceInvoiceInclude<ExtArgs> | null
    /**
     * Filter, which FinanceInvoice to fetch.
     */
    where?: FinanceInvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FinanceInvoices to fetch.
     */
    orderBy?: FinanceInvoiceOrderByWithRelationInput | FinanceInvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FinanceInvoices.
     */
    cursor?: FinanceInvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FinanceInvoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FinanceInvoices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FinanceInvoices.
     */
    distinct?: FinanceInvoiceScalarFieldEnum | FinanceInvoiceScalarFieldEnum[]
  }

  /**
   * FinanceInvoice findMany
   */
  export type FinanceInvoiceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FinanceInvoice
     */
    select?: FinanceInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FinanceInvoice
     */
    omit?: FinanceInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FinanceInvoiceInclude<ExtArgs> | null
    /**
     * Filter, which FinanceInvoices to fetch.
     */
    where?: FinanceInvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FinanceInvoices to fetch.
     */
    orderBy?: FinanceInvoiceOrderByWithRelationInput | FinanceInvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing FinanceInvoices.
     */
    cursor?: FinanceInvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FinanceInvoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FinanceInvoices.
     */
    skip?: number
    distinct?: FinanceInvoiceScalarFieldEnum | FinanceInvoiceScalarFieldEnum[]
  }

  /**
   * FinanceInvoice create
   */
  export type FinanceInvoiceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FinanceInvoice
     */
    select?: FinanceInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FinanceInvoice
     */
    omit?: FinanceInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FinanceInvoiceInclude<ExtArgs> | null
    /**
     * The data needed to create a FinanceInvoice.
     */
    data: XOR<FinanceInvoiceCreateInput, FinanceInvoiceUncheckedCreateInput>
  }

  /**
   * FinanceInvoice createMany
   */
  export type FinanceInvoiceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many FinanceInvoices.
     */
    data: FinanceInvoiceCreateManyInput | FinanceInvoiceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FinanceInvoice createManyAndReturn
   */
  export type FinanceInvoiceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FinanceInvoice
     */
    select?: FinanceInvoiceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FinanceInvoice
     */
    omit?: FinanceInvoiceOmit<ExtArgs> | null
    /**
     * The data used to create many FinanceInvoices.
     */
    data: FinanceInvoiceCreateManyInput | FinanceInvoiceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FinanceInvoice update
   */
  export type FinanceInvoiceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FinanceInvoice
     */
    select?: FinanceInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FinanceInvoice
     */
    omit?: FinanceInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FinanceInvoiceInclude<ExtArgs> | null
    /**
     * The data needed to update a FinanceInvoice.
     */
    data: XOR<FinanceInvoiceUpdateInput, FinanceInvoiceUncheckedUpdateInput>
    /**
     * Choose, which FinanceInvoice to update.
     */
    where: FinanceInvoiceWhereUniqueInput
  }

  /**
   * FinanceInvoice updateMany
   */
  export type FinanceInvoiceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update FinanceInvoices.
     */
    data: XOR<FinanceInvoiceUpdateManyMutationInput, FinanceInvoiceUncheckedUpdateManyInput>
    /**
     * Filter which FinanceInvoices to update
     */
    where?: FinanceInvoiceWhereInput
    /**
     * Limit how many FinanceInvoices to update.
     */
    limit?: number
  }

  /**
   * FinanceInvoice updateManyAndReturn
   */
  export type FinanceInvoiceUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FinanceInvoice
     */
    select?: FinanceInvoiceSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FinanceInvoice
     */
    omit?: FinanceInvoiceOmit<ExtArgs> | null
    /**
     * The data used to update FinanceInvoices.
     */
    data: XOR<FinanceInvoiceUpdateManyMutationInput, FinanceInvoiceUncheckedUpdateManyInput>
    /**
     * Filter which FinanceInvoices to update
     */
    where?: FinanceInvoiceWhereInput
    /**
     * Limit how many FinanceInvoices to update.
     */
    limit?: number
  }

  /**
   * FinanceInvoice upsert
   */
  export type FinanceInvoiceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FinanceInvoice
     */
    select?: FinanceInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FinanceInvoice
     */
    omit?: FinanceInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FinanceInvoiceInclude<ExtArgs> | null
    /**
     * The filter to search for the FinanceInvoice to update in case it exists.
     */
    where: FinanceInvoiceWhereUniqueInput
    /**
     * In case the FinanceInvoice found by the `where` argument doesn't exist, create a new FinanceInvoice with this data.
     */
    create: XOR<FinanceInvoiceCreateInput, FinanceInvoiceUncheckedCreateInput>
    /**
     * In case the FinanceInvoice was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FinanceInvoiceUpdateInput, FinanceInvoiceUncheckedUpdateInput>
  }

  /**
   * FinanceInvoice delete
   */
  export type FinanceInvoiceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FinanceInvoice
     */
    select?: FinanceInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FinanceInvoice
     */
    omit?: FinanceInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FinanceInvoiceInclude<ExtArgs> | null
    /**
     * Filter which FinanceInvoice to delete.
     */
    where: FinanceInvoiceWhereUniqueInput
  }

  /**
   * FinanceInvoice deleteMany
   */
  export type FinanceInvoiceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FinanceInvoices to delete
     */
    where?: FinanceInvoiceWhereInput
    /**
     * Limit how many FinanceInvoices to delete.
     */
    limit?: number
  }

  /**
   * FinanceInvoice.payments
   */
  export type FinanceInvoice$paymentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FinancePayment
     */
    select?: FinancePaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FinancePayment
     */
    omit?: FinancePaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FinancePaymentInclude<ExtArgs> | null
    where?: FinancePaymentWhereInput
    orderBy?: FinancePaymentOrderByWithRelationInput | FinancePaymentOrderByWithRelationInput[]
    cursor?: FinancePaymentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FinancePaymentScalarFieldEnum | FinancePaymentScalarFieldEnum[]
  }

  /**
   * FinanceInvoice without action
   */
  export type FinanceInvoiceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FinanceInvoice
     */
    select?: FinanceInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FinanceInvoice
     */
    omit?: FinanceInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FinanceInvoiceInclude<ExtArgs> | null
  }


  /**
   * Model FinancePayment
   */

  export type AggregateFinancePayment = {
    _count: FinancePaymentCountAggregateOutputType | null
    _avg: FinancePaymentAvgAggregateOutputType | null
    _sum: FinancePaymentSumAggregateOutputType | null
    _min: FinancePaymentMinAggregateOutputType | null
    _max: FinancePaymentMaxAggregateOutputType | null
  }

  export type FinancePaymentAvgAggregateOutputType = {
    amount: Decimal | null
  }

  export type FinancePaymentSumAggregateOutputType = {
    amount: Decimal | null
  }

  export type FinancePaymentMinAggregateOutputType = {
    id: string | null
    invoiceId: string | null
    subscriptionId: string | null
    amount: Decimal | null
    status: $Enums.FinancePaymentStatus | null
    method: string | null
    gocardlessPaymentId: string | null
    paidAt: Date | null
    failedAt: Date | null
    failureReason: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FinancePaymentMaxAggregateOutputType = {
    id: string | null
    invoiceId: string | null
    subscriptionId: string | null
    amount: Decimal | null
    status: $Enums.FinancePaymentStatus | null
    method: string | null
    gocardlessPaymentId: string | null
    paidAt: Date | null
    failedAt: Date | null
    failureReason: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FinancePaymentCountAggregateOutputType = {
    id: number
    invoiceId: number
    subscriptionId: number
    amount: number
    status: number
    method: number
    gocardlessPaymentId: number
    paidAt: number
    failedAt: number
    failureReason: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type FinancePaymentAvgAggregateInputType = {
    amount?: true
  }

  export type FinancePaymentSumAggregateInputType = {
    amount?: true
  }

  export type FinancePaymentMinAggregateInputType = {
    id?: true
    invoiceId?: true
    subscriptionId?: true
    amount?: true
    status?: true
    method?: true
    gocardlessPaymentId?: true
    paidAt?: true
    failedAt?: true
    failureReason?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FinancePaymentMaxAggregateInputType = {
    id?: true
    invoiceId?: true
    subscriptionId?: true
    amount?: true
    status?: true
    method?: true
    gocardlessPaymentId?: true
    paidAt?: true
    failedAt?: true
    failureReason?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FinancePaymentCountAggregateInputType = {
    id?: true
    invoiceId?: true
    subscriptionId?: true
    amount?: true
    status?: true
    method?: true
    gocardlessPaymentId?: true
    paidAt?: true
    failedAt?: true
    failureReason?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type FinancePaymentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FinancePayment to aggregate.
     */
    where?: FinancePaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FinancePayments to fetch.
     */
    orderBy?: FinancePaymentOrderByWithRelationInput | FinancePaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FinancePaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FinancePayments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FinancePayments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned FinancePayments
    **/
    _count?: true | FinancePaymentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FinancePaymentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FinancePaymentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FinancePaymentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FinancePaymentMaxAggregateInputType
  }

  export type GetFinancePaymentAggregateType<T extends FinancePaymentAggregateArgs> = {
        [P in keyof T & keyof AggregateFinancePayment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFinancePayment[P]>
      : GetScalarType<T[P], AggregateFinancePayment[P]>
  }




  export type FinancePaymentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FinancePaymentWhereInput
    orderBy?: FinancePaymentOrderByWithAggregationInput | FinancePaymentOrderByWithAggregationInput[]
    by: FinancePaymentScalarFieldEnum[] | FinancePaymentScalarFieldEnum
    having?: FinancePaymentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FinancePaymentCountAggregateInputType | true
    _avg?: FinancePaymentAvgAggregateInputType
    _sum?: FinancePaymentSumAggregateInputType
    _min?: FinancePaymentMinAggregateInputType
    _max?: FinancePaymentMaxAggregateInputType
  }

  export type FinancePaymentGroupByOutputType = {
    id: string
    invoiceId: string | null
    subscriptionId: string | null
    amount: Decimal
    status: $Enums.FinancePaymentStatus
    method: string | null
    gocardlessPaymentId: string | null
    paidAt: Date | null
    failedAt: Date | null
    failureReason: string | null
    createdAt: Date
    updatedAt: Date
    _count: FinancePaymentCountAggregateOutputType | null
    _avg: FinancePaymentAvgAggregateOutputType | null
    _sum: FinancePaymentSumAggregateOutputType | null
    _min: FinancePaymentMinAggregateOutputType | null
    _max: FinancePaymentMaxAggregateOutputType | null
  }

  type GetFinancePaymentGroupByPayload<T extends FinancePaymentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FinancePaymentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FinancePaymentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FinancePaymentGroupByOutputType[P]>
            : GetScalarType<T[P], FinancePaymentGroupByOutputType[P]>
        }
      >
    >


  export type FinancePaymentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    invoiceId?: boolean
    subscriptionId?: boolean
    amount?: boolean
    status?: boolean
    method?: boolean
    gocardlessPaymentId?: boolean
    paidAt?: boolean
    failedAt?: boolean
    failureReason?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    invoice?: boolean | FinancePayment$invoiceArgs<ExtArgs>
    subscription?: boolean | FinancePayment$subscriptionArgs<ExtArgs>
  }, ExtArgs["result"]["financePayment"]>

  export type FinancePaymentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    invoiceId?: boolean
    subscriptionId?: boolean
    amount?: boolean
    status?: boolean
    method?: boolean
    gocardlessPaymentId?: boolean
    paidAt?: boolean
    failedAt?: boolean
    failureReason?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    invoice?: boolean | FinancePayment$invoiceArgs<ExtArgs>
    subscription?: boolean | FinancePayment$subscriptionArgs<ExtArgs>
  }, ExtArgs["result"]["financePayment"]>

  export type FinancePaymentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    invoiceId?: boolean
    subscriptionId?: boolean
    amount?: boolean
    status?: boolean
    method?: boolean
    gocardlessPaymentId?: boolean
    paidAt?: boolean
    failedAt?: boolean
    failureReason?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    invoice?: boolean | FinancePayment$invoiceArgs<ExtArgs>
    subscription?: boolean | FinancePayment$subscriptionArgs<ExtArgs>
  }, ExtArgs["result"]["financePayment"]>

  export type FinancePaymentSelectScalar = {
    id?: boolean
    invoiceId?: boolean
    subscriptionId?: boolean
    amount?: boolean
    status?: boolean
    method?: boolean
    gocardlessPaymentId?: boolean
    paidAt?: boolean
    failedAt?: boolean
    failureReason?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type FinancePaymentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "invoiceId" | "subscriptionId" | "amount" | "status" | "method" | "gocardlessPaymentId" | "paidAt" | "failedAt" | "failureReason" | "createdAt" | "updatedAt", ExtArgs["result"]["financePayment"]>
  export type FinancePaymentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    invoice?: boolean | FinancePayment$invoiceArgs<ExtArgs>
    subscription?: boolean | FinancePayment$subscriptionArgs<ExtArgs>
  }
  export type FinancePaymentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    invoice?: boolean | FinancePayment$invoiceArgs<ExtArgs>
    subscription?: boolean | FinancePayment$subscriptionArgs<ExtArgs>
  }
  export type FinancePaymentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    invoice?: boolean | FinancePayment$invoiceArgs<ExtArgs>
    subscription?: boolean | FinancePayment$subscriptionArgs<ExtArgs>
  }

  export type $FinancePaymentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "FinancePayment"
    objects: {
      invoice: Prisma.$FinanceInvoicePayload<ExtArgs> | null
      subscription: Prisma.$RevenueSubscriptionPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      invoiceId: string | null
      subscriptionId: string | null
      amount: Prisma.Decimal
      status: $Enums.FinancePaymentStatus
      method: string | null
      gocardlessPaymentId: string | null
      paidAt: Date | null
      failedAt: Date | null
      failureReason: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["financePayment"]>
    composites: {}
  }

  type FinancePaymentGetPayload<S extends boolean | null | undefined | FinancePaymentDefaultArgs> = $Result.GetResult<Prisma.$FinancePaymentPayload, S>

  type FinancePaymentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FinancePaymentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FinancePaymentCountAggregateInputType | true
    }

  export interface FinancePaymentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['FinancePayment'], meta: { name: 'FinancePayment' } }
    /**
     * Find zero or one FinancePayment that matches the filter.
     * @param {FinancePaymentFindUniqueArgs} args - Arguments to find a FinancePayment
     * @example
     * // Get one FinancePayment
     * const financePayment = await prisma.financePayment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FinancePaymentFindUniqueArgs>(args: SelectSubset<T, FinancePaymentFindUniqueArgs<ExtArgs>>): Prisma__FinancePaymentClient<$Result.GetResult<Prisma.$FinancePaymentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one FinancePayment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FinancePaymentFindUniqueOrThrowArgs} args - Arguments to find a FinancePayment
     * @example
     * // Get one FinancePayment
     * const financePayment = await prisma.financePayment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FinancePaymentFindUniqueOrThrowArgs>(args: SelectSubset<T, FinancePaymentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FinancePaymentClient<$Result.GetResult<Prisma.$FinancePaymentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FinancePayment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FinancePaymentFindFirstArgs} args - Arguments to find a FinancePayment
     * @example
     * // Get one FinancePayment
     * const financePayment = await prisma.financePayment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FinancePaymentFindFirstArgs>(args?: SelectSubset<T, FinancePaymentFindFirstArgs<ExtArgs>>): Prisma__FinancePaymentClient<$Result.GetResult<Prisma.$FinancePaymentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FinancePayment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FinancePaymentFindFirstOrThrowArgs} args - Arguments to find a FinancePayment
     * @example
     * // Get one FinancePayment
     * const financePayment = await prisma.financePayment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FinancePaymentFindFirstOrThrowArgs>(args?: SelectSubset<T, FinancePaymentFindFirstOrThrowArgs<ExtArgs>>): Prisma__FinancePaymentClient<$Result.GetResult<Prisma.$FinancePaymentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more FinancePayments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FinancePaymentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FinancePayments
     * const financePayments = await prisma.financePayment.findMany()
     * 
     * // Get first 10 FinancePayments
     * const financePayments = await prisma.financePayment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const financePaymentWithIdOnly = await prisma.financePayment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FinancePaymentFindManyArgs>(args?: SelectSubset<T, FinancePaymentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FinancePaymentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a FinancePayment.
     * @param {FinancePaymentCreateArgs} args - Arguments to create a FinancePayment.
     * @example
     * // Create one FinancePayment
     * const FinancePayment = await prisma.financePayment.create({
     *   data: {
     *     // ... data to create a FinancePayment
     *   }
     * })
     * 
     */
    create<T extends FinancePaymentCreateArgs>(args: SelectSubset<T, FinancePaymentCreateArgs<ExtArgs>>): Prisma__FinancePaymentClient<$Result.GetResult<Prisma.$FinancePaymentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many FinancePayments.
     * @param {FinancePaymentCreateManyArgs} args - Arguments to create many FinancePayments.
     * @example
     * // Create many FinancePayments
     * const financePayment = await prisma.financePayment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FinancePaymentCreateManyArgs>(args?: SelectSubset<T, FinancePaymentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many FinancePayments and returns the data saved in the database.
     * @param {FinancePaymentCreateManyAndReturnArgs} args - Arguments to create many FinancePayments.
     * @example
     * // Create many FinancePayments
     * const financePayment = await prisma.financePayment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many FinancePayments and only return the `id`
     * const financePaymentWithIdOnly = await prisma.financePayment.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FinancePaymentCreateManyAndReturnArgs>(args?: SelectSubset<T, FinancePaymentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FinancePaymentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a FinancePayment.
     * @param {FinancePaymentDeleteArgs} args - Arguments to delete one FinancePayment.
     * @example
     * // Delete one FinancePayment
     * const FinancePayment = await prisma.financePayment.delete({
     *   where: {
     *     // ... filter to delete one FinancePayment
     *   }
     * })
     * 
     */
    delete<T extends FinancePaymentDeleteArgs>(args: SelectSubset<T, FinancePaymentDeleteArgs<ExtArgs>>): Prisma__FinancePaymentClient<$Result.GetResult<Prisma.$FinancePaymentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one FinancePayment.
     * @param {FinancePaymentUpdateArgs} args - Arguments to update one FinancePayment.
     * @example
     * // Update one FinancePayment
     * const financePayment = await prisma.financePayment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FinancePaymentUpdateArgs>(args: SelectSubset<T, FinancePaymentUpdateArgs<ExtArgs>>): Prisma__FinancePaymentClient<$Result.GetResult<Prisma.$FinancePaymentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more FinancePayments.
     * @param {FinancePaymentDeleteManyArgs} args - Arguments to filter FinancePayments to delete.
     * @example
     * // Delete a few FinancePayments
     * const { count } = await prisma.financePayment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FinancePaymentDeleteManyArgs>(args?: SelectSubset<T, FinancePaymentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FinancePayments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FinancePaymentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FinancePayments
     * const financePayment = await prisma.financePayment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FinancePaymentUpdateManyArgs>(args: SelectSubset<T, FinancePaymentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FinancePayments and returns the data updated in the database.
     * @param {FinancePaymentUpdateManyAndReturnArgs} args - Arguments to update many FinancePayments.
     * @example
     * // Update many FinancePayments
     * const financePayment = await prisma.financePayment.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more FinancePayments and only return the `id`
     * const financePaymentWithIdOnly = await prisma.financePayment.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends FinancePaymentUpdateManyAndReturnArgs>(args: SelectSubset<T, FinancePaymentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FinancePaymentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one FinancePayment.
     * @param {FinancePaymentUpsertArgs} args - Arguments to update or create a FinancePayment.
     * @example
     * // Update or create a FinancePayment
     * const financePayment = await prisma.financePayment.upsert({
     *   create: {
     *     // ... data to create a FinancePayment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FinancePayment we want to update
     *   }
     * })
     */
    upsert<T extends FinancePaymentUpsertArgs>(args: SelectSubset<T, FinancePaymentUpsertArgs<ExtArgs>>): Prisma__FinancePaymentClient<$Result.GetResult<Prisma.$FinancePaymentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of FinancePayments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FinancePaymentCountArgs} args - Arguments to filter FinancePayments to count.
     * @example
     * // Count the number of FinancePayments
     * const count = await prisma.financePayment.count({
     *   where: {
     *     // ... the filter for the FinancePayments we want to count
     *   }
     * })
    **/
    count<T extends FinancePaymentCountArgs>(
      args?: Subset<T, FinancePaymentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FinancePaymentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a FinancePayment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FinancePaymentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FinancePaymentAggregateArgs>(args: Subset<T, FinancePaymentAggregateArgs>): Prisma.PrismaPromise<GetFinancePaymentAggregateType<T>>

    /**
     * Group by FinancePayment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FinancePaymentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FinancePaymentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FinancePaymentGroupByArgs['orderBy'] }
        : { orderBy?: FinancePaymentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FinancePaymentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFinancePaymentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the FinancePayment model
   */
  readonly fields: FinancePaymentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for FinancePayment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FinancePaymentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    invoice<T extends FinancePayment$invoiceArgs<ExtArgs> = {}>(args?: Subset<T, FinancePayment$invoiceArgs<ExtArgs>>): Prisma__FinanceInvoiceClient<$Result.GetResult<Prisma.$FinanceInvoicePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    subscription<T extends FinancePayment$subscriptionArgs<ExtArgs> = {}>(args?: Subset<T, FinancePayment$subscriptionArgs<ExtArgs>>): Prisma__RevenueSubscriptionClient<$Result.GetResult<Prisma.$RevenueSubscriptionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the FinancePayment model
   */
  interface FinancePaymentFieldRefs {
    readonly id: FieldRef<"FinancePayment", 'String'>
    readonly invoiceId: FieldRef<"FinancePayment", 'String'>
    readonly subscriptionId: FieldRef<"FinancePayment", 'String'>
    readonly amount: FieldRef<"FinancePayment", 'Decimal'>
    readonly status: FieldRef<"FinancePayment", 'FinancePaymentStatus'>
    readonly method: FieldRef<"FinancePayment", 'String'>
    readonly gocardlessPaymentId: FieldRef<"FinancePayment", 'String'>
    readonly paidAt: FieldRef<"FinancePayment", 'DateTime'>
    readonly failedAt: FieldRef<"FinancePayment", 'DateTime'>
    readonly failureReason: FieldRef<"FinancePayment", 'String'>
    readonly createdAt: FieldRef<"FinancePayment", 'DateTime'>
    readonly updatedAt: FieldRef<"FinancePayment", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * FinancePayment findUnique
   */
  export type FinancePaymentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FinancePayment
     */
    select?: FinancePaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FinancePayment
     */
    omit?: FinancePaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FinancePaymentInclude<ExtArgs> | null
    /**
     * Filter, which FinancePayment to fetch.
     */
    where: FinancePaymentWhereUniqueInput
  }

  /**
   * FinancePayment findUniqueOrThrow
   */
  export type FinancePaymentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FinancePayment
     */
    select?: FinancePaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FinancePayment
     */
    omit?: FinancePaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FinancePaymentInclude<ExtArgs> | null
    /**
     * Filter, which FinancePayment to fetch.
     */
    where: FinancePaymentWhereUniqueInput
  }

  /**
   * FinancePayment findFirst
   */
  export type FinancePaymentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FinancePayment
     */
    select?: FinancePaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FinancePayment
     */
    omit?: FinancePaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FinancePaymentInclude<ExtArgs> | null
    /**
     * Filter, which FinancePayment to fetch.
     */
    where?: FinancePaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FinancePayments to fetch.
     */
    orderBy?: FinancePaymentOrderByWithRelationInput | FinancePaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FinancePayments.
     */
    cursor?: FinancePaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FinancePayments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FinancePayments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FinancePayments.
     */
    distinct?: FinancePaymentScalarFieldEnum | FinancePaymentScalarFieldEnum[]
  }

  /**
   * FinancePayment findFirstOrThrow
   */
  export type FinancePaymentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FinancePayment
     */
    select?: FinancePaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FinancePayment
     */
    omit?: FinancePaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FinancePaymentInclude<ExtArgs> | null
    /**
     * Filter, which FinancePayment to fetch.
     */
    where?: FinancePaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FinancePayments to fetch.
     */
    orderBy?: FinancePaymentOrderByWithRelationInput | FinancePaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FinancePayments.
     */
    cursor?: FinancePaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FinancePayments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FinancePayments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FinancePayments.
     */
    distinct?: FinancePaymentScalarFieldEnum | FinancePaymentScalarFieldEnum[]
  }

  /**
   * FinancePayment findMany
   */
  export type FinancePaymentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FinancePayment
     */
    select?: FinancePaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FinancePayment
     */
    omit?: FinancePaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FinancePaymentInclude<ExtArgs> | null
    /**
     * Filter, which FinancePayments to fetch.
     */
    where?: FinancePaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FinancePayments to fetch.
     */
    orderBy?: FinancePaymentOrderByWithRelationInput | FinancePaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing FinancePayments.
     */
    cursor?: FinancePaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FinancePayments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FinancePayments.
     */
    skip?: number
    distinct?: FinancePaymentScalarFieldEnum | FinancePaymentScalarFieldEnum[]
  }

  /**
   * FinancePayment create
   */
  export type FinancePaymentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FinancePayment
     */
    select?: FinancePaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FinancePayment
     */
    omit?: FinancePaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FinancePaymentInclude<ExtArgs> | null
    /**
     * The data needed to create a FinancePayment.
     */
    data: XOR<FinancePaymentCreateInput, FinancePaymentUncheckedCreateInput>
  }

  /**
   * FinancePayment createMany
   */
  export type FinancePaymentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many FinancePayments.
     */
    data: FinancePaymentCreateManyInput | FinancePaymentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FinancePayment createManyAndReturn
   */
  export type FinancePaymentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FinancePayment
     */
    select?: FinancePaymentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FinancePayment
     */
    omit?: FinancePaymentOmit<ExtArgs> | null
    /**
     * The data used to create many FinancePayments.
     */
    data: FinancePaymentCreateManyInput | FinancePaymentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FinancePaymentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * FinancePayment update
   */
  export type FinancePaymentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FinancePayment
     */
    select?: FinancePaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FinancePayment
     */
    omit?: FinancePaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FinancePaymentInclude<ExtArgs> | null
    /**
     * The data needed to update a FinancePayment.
     */
    data: XOR<FinancePaymentUpdateInput, FinancePaymentUncheckedUpdateInput>
    /**
     * Choose, which FinancePayment to update.
     */
    where: FinancePaymentWhereUniqueInput
  }

  /**
   * FinancePayment updateMany
   */
  export type FinancePaymentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update FinancePayments.
     */
    data: XOR<FinancePaymentUpdateManyMutationInput, FinancePaymentUncheckedUpdateManyInput>
    /**
     * Filter which FinancePayments to update
     */
    where?: FinancePaymentWhereInput
    /**
     * Limit how many FinancePayments to update.
     */
    limit?: number
  }

  /**
   * FinancePayment updateManyAndReturn
   */
  export type FinancePaymentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FinancePayment
     */
    select?: FinancePaymentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FinancePayment
     */
    omit?: FinancePaymentOmit<ExtArgs> | null
    /**
     * The data used to update FinancePayments.
     */
    data: XOR<FinancePaymentUpdateManyMutationInput, FinancePaymentUncheckedUpdateManyInput>
    /**
     * Filter which FinancePayments to update
     */
    where?: FinancePaymentWhereInput
    /**
     * Limit how many FinancePayments to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FinancePaymentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * FinancePayment upsert
   */
  export type FinancePaymentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FinancePayment
     */
    select?: FinancePaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FinancePayment
     */
    omit?: FinancePaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FinancePaymentInclude<ExtArgs> | null
    /**
     * The filter to search for the FinancePayment to update in case it exists.
     */
    where: FinancePaymentWhereUniqueInput
    /**
     * In case the FinancePayment found by the `where` argument doesn't exist, create a new FinancePayment with this data.
     */
    create: XOR<FinancePaymentCreateInput, FinancePaymentUncheckedCreateInput>
    /**
     * In case the FinancePayment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FinancePaymentUpdateInput, FinancePaymentUncheckedUpdateInput>
  }

  /**
   * FinancePayment delete
   */
  export type FinancePaymentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FinancePayment
     */
    select?: FinancePaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FinancePayment
     */
    omit?: FinancePaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FinancePaymentInclude<ExtArgs> | null
    /**
     * Filter which FinancePayment to delete.
     */
    where: FinancePaymentWhereUniqueInput
  }

  /**
   * FinancePayment deleteMany
   */
  export type FinancePaymentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FinancePayments to delete
     */
    where?: FinancePaymentWhereInput
    /**
     * Limit how many FinancePayments to delete.
     */
    limit?: number
  }

  /**
   * FinancePayment.invoice
   */
  export type FinancePayment$invoiceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FinanceInvoice
     */
    select?: FinanceInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FinanceInvoice
     */
    omit?: FinanceInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FinanceInvoiceInclude<ExtArgs> | null
    where?: FinanceInvoiceWhereInput
  }

  /**
   * FinancePayment.subscription
   */
  export type FinancePayment$subscriptionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RevenueSubscription
     */
    select?: RevenueSubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RevenueSubscription
     */
    omit?: RevenueSubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RevenueSubscriptionInclude<ExtArgs> | null
    where?: RevenueSubscriptionWhereInput
  }

  /**
   * FinancePayment without action
   */
  export type FinancePaymentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FinancePayment
     */
    select?: FinancePaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FinancePayment
     */
    omit?: FinancePaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FinancePaymentInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const AdminUserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    passwordHash: 'passwordHash',
    nom: 'nom',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AdminUserScalarFieldEnum = (typeof AdminUserScalarFieldEnum)[keyof typeof AdminUserScalarFieldEnum]


  export const ClientScalarFieldEnum: {
    id: 'id',
    nom: 'nom',
    email: 'email',
    telephone: 'telephone',
    societe: 'societe',
    outil: 'outil',
    statut: 'statut',
    abonnement: 'abonnement',
    trialDebutAt: 'trialDebutAt',
    trialFinAt: 'trialFinAt',
    abonnementActif: 'abonnementActif',
    notes: 'notes',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ClientScalarFieldEnum = (typeof ClientScalarFieldEnum)[keyof typeof ClientScalarFieldEnum]


  export const AccesScalarFieldEnum: {
    id: 'id',
    clientId: 'clientId',
    email: 'email',
    motDePasseTemp: 'motDePasseTemp',
    actif: 'actif',
    premiereConnexion: 'premiereConnexion',
    createdAt: 'createdAt'
  };

  export type AccesScalarFieldEnum = (typeof AccesScalarFieldEnum)[keyof typeof AccesScalarFieldEnum]


  export const MessageScalarFieldEnum: {
    id: 'id',
    clientId: 'clientId',
    nom: 'nom',
    email: 'email',
    societe: 'societe',
    telephone: 'telephone',
    outil: 'outil',
    message: 'message',
    statut: 'statut',
    reponse: 'reponse',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type MessageScalarFieldEnum = (typeof MessageScalarFieldEnum)[keyof typeof MessageScalarFieldEnum]


  export const AuditLogScalarFieldEnum: {
    id: 'id',
    outil: 'outil',
    cibleType: 'cibleType',
    cibleId: 'cibleId',
    action: 'action',
    statut: 'statut',
    acteurId: 'acteurId',
    acteurEmail: 'acteurEmail',
    resume: 'resume',
    avant: 'avant',
    apres: 'apres',
    erreur: 'erreur',
    createdAt: 'createdAt'
  };

  export type AuditLogScalarFieldEnum = (typeof AuditLogScalarFieldEnum)[keyof typeof AuditLogScalarFieldEnum]


  export const ErrorReportScalarFieldEnum: {
    id: 'id',
    outil: 'outil',
    niveau: 'niveau',
    message: 'message',
    stack: 'stack',
    url: 'url',
    userAgent: 'userAgent',
    contexte: 'contexte',
    statut: 'statut',
    notes: 'notes',
    resolution: 'resolution',
    resolvedAt: 'resolvedAt',
    resolvedBy: 'resolvedBy',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ErrorReportScalarFieldEnum = (typeof ErrorReportScalarFieldEnum)[keyof typeof ErrorReportScalarFieldEnum]


  export const FinanceSettingsScalarFieldEnum: {
    id: 'id',
    urssafRate: 'urssafRate',
    vatRate: 'vatRate',
    vatStatus: 'vatStatus',
    declarationFrequency: 'declarationFrequency',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type FinanceSettingsScalarFieldEnum = (typeof FinanceSettingsScalarFieldEnum)[keyof typeof FinanceSettingsScalarFieldEnum]


  export const LysmaExpenseScalarFieldEnum: {
    id: 'id',
    name: 'name',
    provider: 'provider',
    category: 'category',
    relatedTool: 'relatedTool',
    amountHT: 'amountHT',
    vatAmount: 'vatAmount',
    amountTTC: 'amountTTC',
    frequency: 'frequency',
    startDate: 'startDate',
    renewalDate: 'renewalDate',
    paymentMethod: 'paymentMethod',
    status: 'status',
    notes: 'notes',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type LysmaExpenseScalarFieldEnum = (typeof LysmaExpenseScalarFieldEnum)[keyof typeof LysmaExpenseScalarFieldEnum]


  export const RevenueSubscriptionScalarFieldEnum: {
    id: 'id',
    clientName: 'clientName',
    clientCompany: 'clientCompany',
    tool: 'tool',
    planName: 'planName',
    amountHT: 'amountHT',
    vatAmount: 'vatAmount',
    amountTTC: 'amountTTC',
    frequency: 'frequency',
    status: 'status',
    trialStartAt: 'trialStartAt',
    trialEndAt: 'trialEndAt',
    startDate: 'startDate',
    nextInvoiceAt: 'nextInvoiceAt',
    nextPaymentAt: 'nextPaymentAt',
    gocardlessCustomerId: 'gocardlessCustomerId',
    gocardlessMandateId: 'gocardlessMandateId',
    gocardlessSubscriptionId: 'gocardlessSubscriptionId',
    sageCustomerId: 'sageCustomerId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type RevenueSubscriptionScalarFieldEnum = (typeof RevenueSubscriptionScalarFieldEnum)[keyof typeof RevenueSubscriptionScalarFieldEnum]


  export const FinanceInvoiceScalarFieldEnum: {
    id: 'id',
    invoiceNumber: 'invoiceNumber',
    clientName: 'clientName',
    clientCompany: 'clientCompany',
    tool: 'tool',
    amountHT: 'amountHT',
    vatAmount: 'vatAmount',
    amountTTC: 'amountTTC',
    status: 'status',
    issueDate: 'issueDate',
    dueDate: 'dueDate',
    paidAt: 'paidAt',
    pdfUrl: 'pdfUrl',
    sageInvoiceId: 'sageInvoiceId',
    sageInvoiceStatus: 'sageInvoiceStatus',
    electronicInvoiceStatus: 'electronicInvoiceStatus',
    platformProvider: 'platformProvider',
    platformInvoiceId: 'platformInvoiceId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type FinanceInvoiceScalarFieldEnum = (typeof FinanceInvoiceScalarFieldEnum)[keyof typeof FinanceInvoiceScalarFieldEnum]


  export const FinancePaymentScalarFieldEnum: {
    id: 'id',
    invoiceId: 'invoiceId',
    subscriptionId: 'subscriptionId',
    amount: 'amount',
    status: 'status',
    method: 'method',
    gocardlessPaymentId: 'gocardlessPaymentId',
    paidAt: 'paidAt',
    failedAt: 'failedAt',
    failureReason: 'failureReason',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type FinancePaymentScalarFieldEnum = (typeof FinancePaymentScalarFieldEnum)[keyof typeof FinancePaymentScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'ClientStatut'
   */
  export type EnumClientStatutFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ClientStatut'>
    


  /**
   * Reference to a field of type 'ClientStatut[]'
   */
  export type ListEnumClientStatutFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ClientStatut[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'MessageStatut'
   */
  export type EnumMessageStatutFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MessageStatut'>
    


  /**
   * Reference to a field of type 'MessageStatut[]'
   */
  export type ListEnumMessageStatutFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MessageStatut[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'FinanceVatStatus'
   */
  export type EnumFinanceVatStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FinanceVatStatus'>
    


  /**
   * Reference to a field of type 'FinanceVatStatus[]'
   */
  export type ListEnumFinanceVatStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FinanceVatStatus[]'>
    


  /**
   * Reference to a field of type 'FinanceDeclarationFrequency'
   */
  export type EnumFinanceDeclarationFrequencyFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FinanceDeclarationFrequency'>
    


  /**
   * Reference to a field of type 'FinanceDeclarationFrequency[]'
   */
  export type ListEnumFinanceDeclarationFrequencyFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FinanceDeclarationFrequency[]'>
    


  /**
   * Reference to a field of type 'ExpenseCategory'
   */
  export type EnumExpenseCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ExpenseCategory'>
    


  /**
   * Reference to a field of type 'ExpenseCategory[]'
   */
  export type ListEnumExpenseCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ExpenseCategory[]'>
    


  /**
   * Reference to a field of type 'FinanceTool'
   */
  export type EnumFinanceToolFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FinanceTool'>
    


  /**
   * Reference to a field of type 'FinanceTool[]'
   */
  export type ListEnumFinanceToolFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FinanceTool[]'>
    


  /**
   * Reference to a field of type 'FinanceFrequency'
   */
  export type EnumFinanceFrequencyFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FinanceFrequency'>
    


  /**
   * Reference to a field of type 'FinanceFrequency[]'
   */
  export type ListEnumFinanceFrequencyFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FinanceFrequency[]'>
    


  /**
   * Reference to a field of type 'ExpenseStatus'
   */
  export type EnumExpenseStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ExpenseStatus'>
    


  /**
   * Reference to a field of type 'ExpenseStatus[]'
   */
  export type ListEnumExpenseStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ExpenseStatus[]'>
    


  /**
   * Reference to a field of type 'RevenueStatus'
   */
  export type EnumRevenueStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RevenueStatus'>
    


  /**
   * Reference to a field of type 'RevenueStatus[]'
   */
  export type ListEnumRevenueStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RevenueStatus[]'>
    


  /**
   * Reference to a field of type 'FinanceInvoiceStatus'
   */
  export type EnumFinanceInvoiceStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FinanceInvoiceStatus'>
    


  /**
   * Reference to a field of type 'FinanceInvoiceStatus[]'
   */
  export type ListEnumFinanceInvoiceStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FinanceInvoiceStatus[]'>
    


  /**
   * Reference to a field of type 'ElectronicInvoiceStatus'
   */
  export type EnumElectronicInvoiceStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ElectronicInvoiceStatus'>
    


  /**
   * Reference to a field of type 'ElectronicInvoiceStatus[]'
   */
  export type ListEnumElectronicInvoiceStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ElectronicInvoiceStatus[]'>
    


  /**
   * Reference to a field of type 'FinancePaymentStatus'
   */
  export type EnumFinancePaymentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FinancePaymentStatus'>
    


  /**
   * Reference to a field of type 'FinancePaymentStatus[]'
   */
  export type ListEnumFinancePaymentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FinancePaymentStatus[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type AdminUserWhereInput = {
    AND?: AdminUserWhereInput | AdminUserWhereInput[]
    OR?: AdminUserWhereInput[]
    NOT?: AdminUserWhereInput | AdminUserWhereInput[]
    id?: StringFilter<"AdminUser"> | string
    email?: StringFilter<"AdminUser"> | string
    passwordHash?: StringFilter<"AdminUser"> | string
    nom?: StringFilter<"AdminUser"> | string
    createdAt?: DateTimeFilter<"AdminUser"> | Date | string
    updatedAt?: DateTimeFilter<"AdminUser"> | Date | string
  }

  export type AdminUserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    nom?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AdminUserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: AdminUserWhereInput | AdminUserWhereInput[]
    OR?: AdminUserWhereInput[]
    NOT?: AdminUserWhereInput | AdminUserWhereInput[]
    passwordHash?: StringFilter<"AdminUser"> | string
    nom?: StringFilter<"AdminUser"> | string
    createdAt?: DateTimeFilter<"AdminUser"> | Date | string
    updatedAt?: DateTimeFilter<"AdminUser"> | Date | string
  }, "id" | "email">

  export type AdminUserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    nom?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AdminUserCountOrderByAggregateInput
    _max?: AdminUserMaxOrderByAggregateInput
    _min?: AdminUserMinOrderByAggregateInput
  }

  export type AdminUserScalarWhereWithAggregatesInput = {
    AND?: AdminUserScalarWhereWithAggregatesInput | AdminUserScalarWhereWithAggregatesInput[]
    OR?: AdminUserScalarWhereWithAggregatesInput[]
    NOT?: AdminUserScalarWhereWithAggregatesInput | AdminUserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AdminUser"> | string
    email?: StringWithAggregatesFilter<"AdminUser"> | string
    passwordHash?: StringWithAggregatesFilter<"AdminUser"> | string
    nom?: StringWithAggregatesFilter<"AdminUser"> | string
    createdAt?: DateTimeWithAggregatesFilter<"AdminUser"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"AdminUser"> | Date | string
  }

  export type ClientWhereInput = {
    AND?: ClientWhereInput | ClientWhereInput[]
    OR?: ClientWhereInput[]
    NOT?: ClientWhereInput | ClientWhereInput[]
    id?: StringFilter<"Client"> | string
    nom?: StringFilter<"Client"> | string
    email?: StringFilter<"Client"> | string
    telephone?: StringNullableFilter<"Client"> | string | null
    societe?: StringNullableFilter<"Client"> | string | null
    outil?: StringFilter<"Client"> | string
    statut?: EnumClientStatutFilter<"Client"> | $Enums.ClientStatut
    abonnement?: StringNullableFilter<"Client"> | string | null
    trialDebutAt?: DateTimeNullableFilter<"Client"> | Date | string | null
    trialFinAt?: DateTimeNullableFilter<"Client"> | Date | string | null
    abonnementActif?: BoolFilter<"Client"> | boolean
    notes?: StringNullableFilter<"Client"> | string | null
    createdAt?: DateTimeFilter<"Client"> | Date | string
    updatedAt?: DateTimeFilter<"Client"> | Date | string
    acces?: AccesListRelationFilter
    messages?: MessageListRelationFilter
  }

  export type ClientOrderByWithRelationInput = {
    id?: SortOrder
    nom?: SortOrder
    email?: SortOrder
    telephone?: SortOrderInput | SortOrder
    societe?: SortOrderInput | SortOrder
    outil?: SortOrder
    statut?: SortOrder
    abonnement?: SortOrderInput | SortOrder
    trialDebutAt?: SortOrderInput | SortOrder
    trialFinAt?: SortOrderInput | SortOrder
    abonnementActif?: SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    acces?: AccesOrderByRelationAggregateInput
    messages?: MessageOrderByRelationAggregateInput
  }

  export type ClientWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: ClientWhereInput | ClientWhereInput[]
    OR?: ClientWhereInput[]
    NOT?: ClientWhereInput | ClientWhereInput[]
    nom?: StringFilter<"Client"> | string
    telephone?: StringNullableFilter<"Client"> | string | null
    societe?: StringNullableFilter<"Client"> | string | null
    outil?: StringFilter<"Client"> | string
    statut?: EnumClientStatutFilter<"Client"> | $Enums.ClientStatut
    abonnement?: StringNullableFilter<"Client"> | string | null
    trialDebutAt?: DateTimeNullableFilter<"Client"> | Date | string | null
    trialFinAt?: DateTimeNullableFilter<"Client"> | Date | string | null
    abonnementActif?: BoolFilter<"Client"> | boolean
    notes?: StringNullableFilter<"Client"> | string | null
    createdAt?: DateTimeFilter<"Client"> | Date | string
    updatedAt?: DateTimeFilter<"Client"> | Date | string
    acces?: AccesListRelationFilter
    messages?: MessageListRelationFilter
  }, "id" | "email">

  export type ClientOrderByWithAggregationInput = {
    id?: SortOrder
    nom?: SortOrder
    email?: SortOrder
    telephone?: SortOrderInput | SortOrder
    societe?: SortOrderInput | SortOrder
    outil?: SortOrder
    statut?: SortOrder
    abonnement?: SortOrderInput | SortOrder
    trialDebutAt?: SortOrderInput | SortOrder
    trialFinAt?: SortOrderInput | SortOrder
    abonnementActif?: SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ClientCountOrderByAggregateInput
    _max?: ClientMaxOrderByAggregateInput
    _min?: ClientMinOrderByAggregateInput
  }

  export type ClientScalarWhereWithAggregatesInput = {
    AND?: ClientScalarWhereWithAggregatesInput | ClientScalarWhereWithAggregatesInput[]
    OR?: ClientScalarWhereWithAggregatesInput[]
    NOT?: ClientScalarWhereWithAggregatesInput | ClientScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Client"> | string
    nom?: StringWithAggregatesFilter<"Client"> | string
    email?: StringWithAggregatesFilter<"Client"> | string
    telephone?: StringNullableWithAggregatesFilter<"Client"> | string | null
    societe?: StringNullableWithAggregatesFilter<"Client"> | string | null
    outil?: StringWithAggregatesFilter<"Client"> | string
    statut?: EnumClientStatutWithAggregatesFilter<"Client"> | $Enums.ClientStatut
    abonnement?: StringNullableWithAggregatesFilter<"Client"> | string | null
    trialDebutAt?: DateTimeNullableWithAggregatesFilter<"Client"> | Date | string | null
    trialFinAt?: DateTimeNullableWithAggregatesFilter<"Client"> | Date | string | null
    abonnementActif?: BoolWithAggregatesFilter<"Client"> | boolean
    notes?: StringNullableWithAggregatesFilter<"Client"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Client"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Client"> | Date | string
  }

  export type AccesWhereInput = {
    AND?: AccesWhereInput | AccesWhereInput[]
    OR?: AccesWhereInput[]
    NOT?: AccesWhereInput | AccesWhereInput[]
    id?: StringFilter<"Acces"> | string
    clientId?: StringFilter<"Acces"> | string
    email?: StringFilter<"Acces"> | string
    motDePasseTemp?: StringNullableFilter<"Acces"> | string | null
    actif?: BoolFilter<"Acces"> | boolean
    premiereConnexion?: BoolFilter<"Acces"> | boolean
    createdAt?: DateTimeFilter<"Acces"> | Date | string
    client?: XOR<ClientScalarRelationFilter, ClientWhereInput>
  }

  export type AccesOrderByWithRelationInput = {
    id?: SortOrder
    clientId?: SortOrder
    email?: SortOrder
    motDePasseTemp?: SortOrderInput | SortOrder
    actif?: SortOrder
    premiereConnexion?: SortOrder
    createdAt?: SortOrder
    client?: ClientOrderByWithRelationInput
  }

  export type AccesWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AccesWhereInput | AccesWhereInput[]
    OR?: AccesWhereInput[]
    NOT?: AccesWhereInput | AccesWhereInput[]
    clientId?: StringFilter<"Acces"> | string
    email?: StringFilter<"Acces"> | string
    motDePasseTemp?: StringNullableFilter<"Acces"> | string | null
    actif?: BoolFilter<"Acces"> | boolean
    premiereConnexion?: BoolFilter<"Acces"> | boolean
    createdAt?: DateTimeFilter<"Acces"> | Date | string
    client?: XOR<ClientScalarRelationFilter, ClientWhereInput>
  }, "id">

  export type AccesOrderByWithAggregationInput = {
    id?: SortOrder
    clientId?: SortOrder
    email?: SortOrder
    motDePasseTemp?: SortOrderInput | SortOrder
    actif?: SortOrder
    premiereConnexion?: SortOrder
    createdAt?: SortOrder
    _count?: AccesCountOrderByAggregateInput
    _max?: AccesMaxOrderByAggregateInput
    _min?: AccesMinOrderByAggregateInput
  }

  export type AccesScalarWhereWithAggregatesInput = {
    AND?: AccesScalarWhereWithAggregatesInput | AccesScalarWhereWithAggregatesInput[]
    OR?: AccesScalarWhereWithAggregatesInput[]
    NOT?: AccesScalarWhereWithAggregatesInput | AccesScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Acces"> | string
    clientId?: StringWithAggregatesFilter<"Acces"> | string
    email?: StringWithAggregatesFilter<"Acces"> | string
    motDePasseTemp?: StringNullableWithAggregatesFilter<"Acces"> | string | null
    actif?: BoolWithAggregatesFilter<"Acces"> | boolean
    premiereConnexion?: BoolWithAggregatesFilter<"Acces"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Acces"> | Date | string
  }

  export type MessageWhereInput = {
    AND?: MessageWhereInput | MessageWhereInput[]
    OR?: MessageWhereInput[]
    NOT?: MessageWhereInput | MessageWhereInput[]
    id?: StringFilter<"Message"> | string
    clientId?: StringNullableFilter<"Message"> | string | null
    nom?: StringFilter<"Message"> | string
    email?: StringFilter<"Message"> | string
    societe?: StringNullableFilter<"Message"> | string | null
    telephone?: StringNullableFilter<"Message"> | string | null
    outil?: StringFilter<"Message"> | string
    message?: StringFilter<"Message"> | string
    statut?: EnumMessageStatutFilter<"Message"> | $Enums.MessageStatut
    reponse?: StringNullableFilter<"Message"> | string | null
    createdAt?: DateTimeFilter<"Message"> | Date | string
    updatedAt?: DateTimeFilter<"Message"> | Date | string
    client?: XOR<ClientNullableScalarRelationFilter, ClientWhereInput> | null
  }

  export type MessageOrderByWithRelationInput = {
    id?: SortOrder
    clientId?: SortOrderInput | SortOrder
    nom?: SortOrder
    email?: SortOrder
    societe?: SortOrderInput | SortOrder
    telephone?: SortOrderInput | SortOrder
    outil?: SortOrder
    message?: SortOrder
    statut?: SortOrder
    reponse?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    client?: ClientOrderByWithRelationInput
  }

  export type MessageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MessageWhereInput | MessageWhereInput[]
    OR?: MessageWhereInput[]
    NOT?: MessageWhereInput | MessageWhereInput[]
    clientId?: StringNullableFilter<"Message"> | string | null
    nom?: StringFilter<"Message"> | string
    email?: StringFilter<"Message"> | string
    societe?: StringNullableFilter<"Message"> | string | null
    telephone?: StringNullableFilter<"Message"> | string | null
    outil?: StringFilter<"Message"> | string
    message?: StringFilter<"Message"> | string
    statut?: EnumMessageStatutFilter<"Message"> | $Enums.MessageStatut
    reponse?: StringNullableFilter<"Message"> | string | null
    createdAt?: DateTimeFilter<"Message"> | Date | string
    updatedAt?: DateTimeFilter<"Message"> | Date | string
    client?: XOR<ClientNullableScalarRelationFilter, ClientWhereInput> | null
  }, "id">

  export type MessageOrderByWithAggregationInput = {
    id?: SortOrder
    clientId?: SortOrderInput | SortOrder
    nom?: SortOrder
    email?: SortOrder
    societe?: SortOrderInput | SortOrder
    telephone?: SortOrderInput | SortOrder
    outil?: SortOrder
    message?: SortOrder
    statut?: SortOrder
    reponse?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: MessageCountOrderByAggregateInput
    _max?: MessageMaxOrderByAggregateInput
    _min?: MessageMinOrderByAggregateInput
  }

  export type MessageScalarWhereWithAggregatesInput = {
    AND?: MessageScalarWhereWithAggregatesInput | MessageScalarWhereWithAggregatesInput[]
    OR?: MessageScalarWhereWithAggregatesInput[]
    NOT?: MessageScalarWhereWithAggregatesInput | MessageScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Message"> | string
    clientId?: StringNullableWithAggregatesFilter<"Message"> | string | null
    nom?: StringWithAggregatesFilter<"Message"> | string
    email?: StringWithAggregatesFilter<"Message"> | string
    societe?: StringNullableWithAggregatesFilter<"Message"> | string | null
    telephone?: StringNullableWithAggregatesFilter<"Message"> | string | null
    outil?: StringWithAggregatesFilter<"Message"> | string
    message?: StringWithAggregatesFilter<"Message"> | string
    statut?: EnumMessageStatutWithAggregatesFilter<"Message"> | $Enums.MessageStatut
    reponse?: StringNullableWithAggregatesFilter<"Message"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Message"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Message"> | Date | string
  }

  export type AuditLogWhereInput = {
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    id?: StringFilter<"AuditLog"> | string
    outil?: StringFilter<"AuditLog"> | string
    cibleType?: StringFilter<"AuditLog"> | string
    cibleId?: StringNullableFilter<"AuditLog"> | string | null
    action?: StringFilter<"AuditLog"> | string
    statut?: StringFilter<"AuditLog"> | string
    acteurId?: StringNullableFilter<"AuditLog"> | string | null
    acteurEmail?: StringNullableFilter<"AuditLog"> | string | null
    resume?: StringNullableFilter<"AuditLog"> | string | null
    avant?: JsonNullableFilter<"AuditLog">
    apres?: JsonNullableFilter<"AuditLog">
    erreur?: StringNullableFilter<"AuditLog"> | string | null
    createdAt?: DateTimeFilter<"AuditLog"> | Date | string
  }

  export type AuditLogOrderByWithRelationInput = {
    id?: SortOrder
    outil?: SortOrder
    cibleType?: SortOrder
    cibleId?: SortOrderInput | SortOrder
    action?: SortOrder
    statut?: SortOrder
    acteurId?: SortOrderInput | SortOrder
    acteurEmail?: SortOrderInput | SortOrder
    resume?: SortOrderInput | SortOrder
    avant?: SortOrderInput | SortOrder
    apres?: SortOrderInput | SortOrder
    erreur?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type AuditLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    outil?: StringFilter<"AuditLog"> | string
    cibleType?: StringFilter<"AuditLog"> | string
    cibleId?: StringNullableFilter<"AuditLog"> | string | null
    action?: StringFilter<"AuditLog"> | string
    statut?: StringFilter<"AuditLog"> | string
    acteurId?: StringNullableFilter<"AuditLog"> | string | null
    acteurEmail?: StringNullableFilter<"AuditLog"> | string | null
    resume?: StringNullableFilter<"AuditLog"> | string | null
    avant?: JsonNullableFilter<"AuditLog">
    apres?: JsonNullableFilter<"AuditLog">
    erreur?: StringNullableFilter<"AuditLog"> | string | null
    createdAt?: DateTimeFilter<"AuditLog"> | Date | string
  }, "id">

  export type AuditLogOrderByWithAggregationInput = {
    id?: SortOrder
    outil?: SortOrder
    cibleType?: SortOrder
    cibleId?: SortOrderInput | SortOrder
    action?: SortOrder
    statut?: SortOrder
    acteurId?: SortOrderInput | SortOrder
    acteurEmail?: SortOrderInput | SortOrder
    resume?: SortOrderInput | SortOrder
    avant?: SortOrderInput | SortOrder
    apres?: SortOrderInput | SortOrder
    erreur?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: AuditLogCountOrderByAggregateInput
    _max?: AuditLogMaxOrderByAggregateInput
    _min?: AuditLogMinOrderByAggregateInput
  }

  export type AuditLogScalarWhereWithAggregatesInput = {
    AND?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    OR?: AuditLogScalarWhereWithAggregatesInput[]
    NOT?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AuditLog"> | string
    outil?: StringWithAggregatesFilter<"AuditLog"> | string
    cibleType?: StringWithAggregatesFilter<"AuditLog"> | string
    cibleId?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    action?: StringWithAggregatesFilter<"AuditLog"> | string
    statut?: StringWithAggregatesFilter<"AuditLog"> | string
    acteurId?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    acteurEmail?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    resume?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    avant?: JsonNullableWithAggregatesFilter<"AuditLog">
    apres?: JsonNullableWithAggregatesFilter<"AuditLog">
    erreur?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"AuditLog"> | Date | string
  }

  export type ErrorReportWhereInput = {
    AND?: ErrorReportWhereInput | ErrorReportWhereInput[]
    OR?: ErrorReportWhereInput[]
    NOT?: ErrorReportWhereInput | ErrorReportWhereInput[]
    id?: StringFilter<"ErrorReport"> | string
    outil?: StringFilter<"ErrorReport"> | string
    niveau?: StringFilter<"ErrorReport"> | string
    message?: StringFilter<"ErrorReport"> | string
    stack?: StringNullableFilter<"ErrorReport"> | string | null
    url?: StringNullableFilter<"ErrorReport"> | string | null
    userAgent?: StringNullableFilter<"ErrorReport"> | string | null
    contexte?: JsonNullableFilter<"ErrorReport">
    statut?: StringFilter<"ErrorReport"> | string
    notes?: StringNullableFilter<"ErrorReport"> | string | null
    resolution?: StringNullableFilter<"ErrorReport"> | string | null
    resolvedAt?: DateTimeNullableFilter<"ErrorReport"> | Date | string | null
    resolvedBy?: StringNullableFilter<"ErrorReport"> | string | null
    createdAt?: DateTimeFilter<"ErrorReport"> | Date | string
    updatedAt?: DateTimeFilter<"ErrorReport"> | Date | string
  }

  export type ErrorReportOrderByWithRelationInput = {
    id?: SortOrder
    outil?: SortOrder
    niveau?: SortOrder
    message?: SortOrder
    stack?: SortOrderInput | SortOrder
    url?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    contexte?: SortOrderInput | SortOrder
    statut?: SortOrder
    notes?: SortOrderInput | SortOrder
    resolution?: SortOrderInput | SortOrder
    resolvedAt?: SortOrderInput | SortOrder
    resolvedBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ErrorReportWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ErrorReportWhereInput | ErrorReportWhereInput[]
    OR?: ErrorReportWhereInput[]
    NOT?: ErrorReportWhereInput | ErrorReportWhereInput[]
    outil?: StringFilter<"ErrorReport"> | string
    niveau?: StringFilter<"ErrorReport"> | string
    message?: StringFilter<"ErrorReport"> | string
    stack?: StringNullableFilter<"ErrorReport"> | string | null
    url?: StringNullableFilter<"ErrorReport"> | string | null
    userAgent?: StringNullableFilter<"ErrorReport"> | string | null
    contexte?: JsonNullableFilter<"ErrorReport">
    statut?: StringFilter<"ErrorReport"> | string
    notes?: StringNullableFilter<"ErrorReport"> | string | null
    resolution?: StringNullableFilter<"ErrorReport"> | string | null
    resolvedAt?: DateTimeNullableFilter<"ErrorReport"> | Date | string | null
    resolvedBy?: StringNullableFilter<"ErrorReport"> | string | null
    createdAt?: DateTimeFilter<"ErrorReport"> | Date | string
    updatedAt?: DateTimeFilter<"ErrorReport"> | Date | string
  }, "id">

  export type ErrorReportOrderByWithAggregationInput = {
    id?: SortOrder
    outil?: SortOrder
    niveau?: SortOrder
    message?: SortOrder
    stack?: SortOrderInput | SortOrder
    url?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    contexte?: SortOrderInput | SortOrder
    statut?: SortOrder
    notes?: SortOrderInput | SortOrder
    resolution?: SortOrderInput | SortOrder
    resolvedAt?: SortOrderInput | SortOrder
    resolvedBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ErrorReportCountOrderByAggregateInput
    _max?: ErrorReportMaxOrderByAggregateInput
    _min?: ErrorReportMinOrderByAggregateInput
  }

  export type ErrorReportScalarWhereWithAggregatesInput = {
    AND?: ErrorReportScalarWhereWithAggregatesInput | ErrorReportScalarWhereWithAggregatesInput[]
    OR?: ErrorReportScalarWhereWithAggregatesInput[]
    NOT?: ErrorReportScalarWhereWithAggregatesInput | ErrorReportScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ErrorReport"> | string
    outil?: StringWithAggregatesFilter<"ErrorReport"> | string
    niveau?: StringWithAggregatesFilter<"ErrorReport"> | string
    message?: StringWithAggregatesFilter<"ErrorReport"> | string
    stack?: StringNullableWithAggregatesFilter<"ErrorReport"> | string | null
    url?: StringNullableWithAggregatesFilter<"ErrorReport"> | string | null
    userAgent?: StringNullableWithAggregatesFilter<"ErrorReport"> | string | null
    contexte?: JsonNullableWithAggregatesFilter<"ErrorReport">
    statut?: StringWithAggregatesFilter<"ErrorReport"> | string
    notes?: StringNullableWithAggregatesFilter<"ErrorReport"> | string | null
    resolution?: StringNullableWithAggregatesFilter<"ErrorReport"> | string | null
    resolvedAt?: DateTimeNullableWithAggregatesFilter<"ErrorReport"> | Date | string | null
    resolvedBy?: StringNullableWithAggregatesFilter<"ErrorReport"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"ErrorReport"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ErrorReport"> | Date | string
  }

  export type FinanceSettingsWhereInput = {
    AND?: FinanceSettingsWhereInput | FinanceSettingsWhereInput[]
    OR?: FinanceSettingsWhereInput[]
    NOT?: FinanceSettingsWhereInput | FinanceSettingsWhereInput[]
    id?: StringFilter<"FinanceSettings"> | string
    urssafRate?: DecimalFilter<"FinanceSettings"> | Decimal | DecimalJsLike | number | string
    vatRate?: DecimalFilter<"FinanceSettings"> | Decimal | DecimalJsLike | number | string
    vatStatus?: EnumFinanceVatStatusFilter<"FinanceSettings"> | $Enums.FinanceVatStatus
    declarationFrequency?: EnumFinanceDeclarationFrequencyFilter<"FinanceSettings"> | $Enums.FinanceDeclarationFrequency
    createdAt?: DateTimeFilter<"FinanceSettings"> | Date | string
    updatedAt?: DateTimeFilter<"FinanceSettings"> | Date | string
  }

  export type FinanceSettingsOrderByWithRelationInput = {
    id?: SortOrder
    urssafRate?: SortOrder
    vatRate?: SortOrder
    vatStatus?: SortOrder
    declarationFrequency?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FinanceSettingsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: FinanceSettingsWhereInput | FinanceSettingsWhereInput[]
    OR?: FinanceSettingsWhereInput[]
    NOT?: FinanceSettingsWhereInput | FinanceSettingsWhereInput[]
    urssafRate?: DecimalFilter<"FinanceSettings"> | Decimal | DecimalJsLike | number | string
    vatRate?: DecimalFilter<"FinanceSettings"> | Decimal | DecimalJsLike | number | string
    vatStatus?: EnumFinanceVatStatusFilter<"FinanceSettings"> | $Enums.FinanceVatStatus
    declarationFrequency?: EnumFinanceDeclarationFrequencyFilter<"FinanceSettings"> | $Enums.FinanceDeclarationFrequency
    createdAt?: DateTimeFilter<"FinanceSettings"> | Date | string
    updatedAt?: DateTimeFilter<"FinanceSettings"> | Date | string
  }, "id">

  export type FinanceSettingsOrderByWithAggregationInput = {
    id?: SortOrder
    urssafRate?: SortOrder
    vatRate?: SortOrder
    vatStatus?: SortOrder
    declarationFrequency?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: FinanceSettingsCountOrderByAggregateInput
    _avg?: FinanceSettingsAvgOrderByAggregateInput
    _max?: FinanceSettingsMaxOrderByAggregateInput
    _min?: FinanceSettingsMinOrderByAggregateInput
    _sum?: FinanceSettingsSumOrderByAggregateInput
  }

  export type FinanceSettingsScalarWhereWithAggregatesInput = {
    AND?: FinanceSettingsScalarWhereWithAggregatesInput | FinanceSettingsScalarWhereWithAggregatesInput[]
    OR?: FinanceSettingsScalarWhereWithAggregatesInput[]
    NOT?: FinanceSettingsScalarWhereWithAggregatesInput | FinanceSettingsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"FinanceSettings"> | string
    urssafRate?: DecimalWithAggregatesFilter<"FinanceSettings"> | Decimal | DecimalJsLike | number | string
    vatRate?: DecimalWithAggregatesFilter<"FinanceSettings"> | Decimal | DecimalJsLike | number | string
    vatStatus?: EnumFinanceVatStatusWithAggregatesFilter<"FinanceSettings"> | $Enums.FinanceVatStatus
    declarationFrequency?: EnumFinanceDeclarationFrequencyWithAggregatesFilter<"FinanceSettings"> | $Enums.FinanceDeclarationFrequency
    createdAt?: DateTimeWithAggregatesFilter<"FinanceSettings"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"FinanceSettings"> | Date | string
  }

  export type LysmaExpenseWhereInput = {
    AND?: LysmaExpenseWhereInput | LysmaExpenseWhereInput[]
    OR?: LysmaExpenseWhereInput[]
    NOT?: LysmaExpenseWhereInput | LysmaExpenseWhereInput[]
    id?: StringFilter<"LysmaExpense"> | string
    name?: StringFilter<"LysmaExpense"> | string
    provider?: StringFilter<"LysmaExpense"> | string
    category?: EnumExpenseCategoryFilter<"LysmaExpense"> | $Enums.ExpenseCategory
    relatedTool?: EnumFinanceToolFilter<"LysmaExpense"> | $Enums.FinanceTool
    amountHT?: DecimalFilter<"LysmaExpense"> | Decimal | DecimalJsLike | number | string
    vatAmount?: DecimalFilter<"LysmaExpense"> | Decimal | DecimalJsLike | number | string
    amountTTC?: DecimalFilter<"LysmaExpense"> | Decimal | DecimalJsLike | number | string
    frequency?: EnumFinanceFrequencyFilter<"LysmaExpense"> | $Enums.FinanceFrequency
    startDate?: DateTimeFilter<"LysmaExpense"> | Date | string
    renewalDate?: DateTimeNullableFilter<"LysmaExpense"> | Date | string | null
    paymentMethod?: StringNullableFilter<"LysmaExpense"> | string | null
    status?: EnumExpenseStatusFilter<"LysmaExpense"> | $Enums.ExpenseStatus
    notes?: StringNullableFilter<"LysmaExpense"> | string | null
    createdAt?: DateTimeFilter<"LysmaExpense"> | Date | string
    updatedAt?: DateTimeFilter<"LysmaExpense"> | Date | string
  }

  export type LysmaExpenseOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    provider?: SortOrder
    category?: SortOrder
    relatedTool?: SortOrder
    amountHT?: SortOrder
    vatAmount?: SortOrder
    amountTTC?: SortOrder
    frequency?: SortOrder
    startDate?: SortOrder
    renewalDate?: SortOrderInput | SortOrder
    paymentMethod?: SortOrderInput | SortOrder
    status?: SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LysmaExpenseWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LysmaExpenseWhereInput | LysmaExpenseWhereInput[]
    OR?: LysmaExpenseWhereInput[]
    NOT?: LysmaExpenseWhereInput | LysmaExpenseWhereInput[]
    name?: StringFilter<"LysmaExpense"> | string
    provider?: StringFilter<"LysmaExpense"> | string
    category?: EnumExpenseCategoryFilter<"LysmaExpense"> | $Enums.ExpenseCategory
    relatedTool?: EnumFinanceToolFilter<"LysmaExpense"> | $Enums.FinanceTool
    amountHT?: DecimalFilter<"LysmaExpense"> | Decimal | DecimalJsLike | number | string
    vatAmount?: DecimalFilter<"LysmaExpense"> | Decimal | DecimalJsLike | number | string
    amountTTC?: DecimalFilter<"LysmaExpense"> | Decimal | DecimalJsLike | number | string
    frequency?: EnumFinanceFrequencyFilter<"LysmaExpense"> | $Enums.FinanceFrequency
    startDate?: DateTimeFilter<"LysmaExpense"> | Date | string
    renewalDate?: DateTimeNullableFilter<"LysmaExpense"> | Date | string | null
    paymentMethod?: StringNullableFilter<"LysmaExpense"> | string | null
    status?: EnumExpenseStatusFilter<"LysmaExpense"> | $Enums.ExpenseStatus
    notes?: StringNullableFilter<"LysmaExpense"> | string | null
    createdAt?: DateTimeFilter<"LysmaExpense"> | Date | string
    updatedAt?: DateTimeFilter<"LysmaExpense"> | Date | string
  }, "id">

  export type LysmaExpenseOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    provider?: SortOrder
    category?: SortOrder
    relatedTool?: SortOrder
    amountHT?: SortOrder
    vatAmount?: SortOrder
    amountTTC?: SortOrder
    frequency?: SortOrder
    startDate?: SortOrder
    renewalDate?: SortOrderInput | SortOrder
    paymentMethod?: SortOrderInput | SortOrder
    status?: SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: LysmaExpenseCountOrderByAggregateInput
    _avg?: LysmaExpenseAvgOrderByAggregateInput
    _max?: LysmaExpenseMaxOrderByAggregateInput
    _min?: LysmaExpenseMinOrderByAggregateInput
    _sum?: LysmaExpenseSumOrderByAggregateInput
  }

  export type LysmaExpenseScalarWhereWithAggregatesInput = {
    AND?: LysmaExpenseScalarWhereWithAggregatesInput | LysmaExpenseScalarWhereWithAggregatesInput[]
    OR?: LysmaExpenseScalarWhereWithAggregatesInput[]
    NOT?: LysmaExpenseScalarWhereWithAggregatesInput | LysmaExpenseScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LysmaExpense"> | string
    name?: StringWithAggregatesFilter<"LysmaExpense"> | string
    provider?: StringWithAggregatesFilter<"LysmaExpense"> | string
    category?: EnumExpenseCategoryWithAggregatesFilter<"LysmaExpense"> | $Enums.ExpenseCategory
    relatedTool?: EnumFinanceToolWithAggregatesFilter<"LysmaExpense"> | $Enums.FinanceTool
    amountHT?: DecimalWithAggregatesFilter<"LysmaExpense"> | Decimal | DecimalJsLike | number | string
    vatAmount?: DecimalWithAggregatesFilter<"LysmaExpense"> | Decimal | DecimalJsLike | number | string
    amountTTC?: DecimalWithAggregatesFilter<"LysmaExpense"> | Decimal | DecimalJsLike | number | string
    frequency?: EnumFinanceFrequencyWithAggregatesFilter<"LysmaExpense"> | $Enums.FinanceFrequency
    startDate?: DateTimeWithAggregatesFilter<"LysmaExpense"> | Date | string
    renewalDate?: DateTimeNullableWithAggregatesFilter<"LysmaExpense"> | Date | string | null
    paymentMethod?: StringNullableWithAggregatesFilter<"LysmaExpense"> | string | null
    status?: EnumExpenseStatusWithAggregatesFilter<"LysmaExpense"> | $Enums.ExpenseStatus
    notes?: StringNullableWithAggregatesFilter<"LysmaExpense"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"LysmaExpense"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"LysmaExpense"> | Date | string
  }

  export type RevenueSubscriptionWhereInput = {
    AND?: RevenueSubscriptionWhereInput | RevenueSubscriptionWhereInput[]
    OR?: RevenueSubscriptionWhereInput[]
    NOT?: RevenueSubscriptionWhereInput | RevenueSubscriptionWhereInput[]
    id?: StringFilter<"RevenueSubscription"> | string
    clientName?: StringFilter<"RevenueSubscription"> | string
    clientCompany?: StringNullableFilter<"RevenueSubscription"> | string | null
    tool?: EnumFinanceToolFilter<"RevenueSubscription"> | $Enums.FinanceTool
    planName?: StringFilter<"RevenueSubscription"> | string
    amountHT?: DecimalFilter<"RevenueSubscription"> | Decimal | DecimalJsLike | number | string
    vatAmount?: DecimalFilter<"RevenueSubscription"> | Decimal | DecimalJsLike | number | string
    amountTTC?: DecimalFilter<"RevenueSubscription"> | Decimal | DecimalJsLike | number | string
    frequency?: EnumFinanceFrequencyFilter<"RevenueSubscription"> | $Enums.FinanceFrequency
    status?: EnumRevenueStatusFilter<"RevenueSubscription"> | $Enums.RevenueStatus
    trialStartAt?: DateTimeNullableFilter<"RevenueSubscription"> | Date | string | null
    trialEndAt?: DateTimeNullableFilter<"RevenueSubscription"> | Date | string | null
    startDate?: DateTimeFilter<"RevenueSubscription"> | Date | string
    nextInvoiceAt?: DateTimeNullableFilter<"RevenueSubscription"> | Date | string | null
    nextPaymentAt?: DateTimeNullableFilter<"RevenueSubscription"> | Date | string | null
    gocardlessCustomerId?: StringNullableFilter<"RevenueSubscription"> | string | null
    gocardlessMandateId?: StringNullableFilter<"RevenueSubscription"> | string | null
    gocardlessSubscriptionId?: StringNullableFilter<"RevenueSubscription"> | string | null
    sageCustomerId?: StringNullableFilter<"RevenueSubscription"> | string | null
    createdAt?: DateTimeFilter<"RevenueSubscription"> | Date | string
    updatedAt?: DateTimeFilter<"RevenueSubscription"> | Date | string
    payments?: FinancePaymentListRelationFilter
  }

  export type RevenueSubscriptionOrderByWithRelationInput = {
    id?: SortOrder
    clientName?: SortOrder
    clientCompany?: SortOrderInput | SortOrder
    tool?: SortOrder
    planName?: SortOrder
    amountHT?: SortOrder
    vatAmount?: SortOrder
    amountTTC?: SortOrder
    frequency?: SortOrder
    status?: SortOrder
    trialStartAt?: SortOrderInput | SortOrder
    trialEndAt?: SortOrderInput | SortOrder
    startDate?: SortOrder
    nextInvoiceAt?: SortOrderInput | SortOrder
    nextPaymentAt?: SortOrderInput | SortOrder
    gocardlessCustomerId?: SortOrderInput | SortOrder
    gocardlessMandateId?: SortOrderInput | SortOrder
    gocardlessSubscriptionId?: SortOrderInput | SortOrder
    sageCustomerId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    payments?: FinancePaymentOrderByRelationAggregateInput
  }

  export type RevenueSubscriptionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: RevenueSubscriptionWhereInput | RevenueSubscriptionWhereInput[]
    OR?: RevenueSubscriptionWhereInput[]
    NOT?: RevenueSubscriptionWhereInput | RevenueSubscriptionWhereInput[]
    clientName?: StringFilter<"RevenueSubscription"> | string
    clientCompany?: StringNullableFilter<"RevenueSubscription"> | string | null
    tool?: EnumFinanceToolFilter<"RevenueSubscription"> | $Enums.FinanceTool
    planName?: StringFilter<"RevenueSubscription"> | string
    amountHT?: DecimalFilter<"RevenueSubscription"> | Decimal | DecimalJsLike | number | string
    vatAmount?: DecimalFilter<"RevenueSubscription"> | Decimal | DecimalJsLike | number | string
    amountTTC?: DecimalFilter<"RevenueSubscription"> | Decimal | DecimalJsLike | number | string
    frequency?: EnumFinanceFrequencyFilter<"RevenueSubscription"> | $Enums.FinanceFrequency
    status?: EnumRevenueStatusFilter<"RevenueSubscription"> | $Enums.RevenueStatus
    trialStartAt?: DateTimeNullableFilter<"RevenueSubscription"> | Date | string | null
    trialEndAt?: DateTimeNullableFilter<"RevenueSubscription"> | Date | string | null
    startDate?: DateTimeFilter<"RevenueSubscription"> | Date | string
    nextInvoiceAt?: DateTimeNullableFilter<"RevenueSubscription"> | Date | string | null
    nextPaymentAt?: DateTimeNullableFilter<"RevenueSubscription"> | Date | string | null
    gocardlessCustomerId?: StringNullableFilter<"RevenueSubscription"> | string | null
    gocardlessMandateId?: StringNullableFilter<"RevenueSubscription"> | string | null
    gocardlessSubscriptionId?: StringNullableFilter<"RevenueSubscription"> | string | null
    sageCustomerId?: StringNullableFilter<"RevenueSubscription"> | string | null
    createdAt?: DateTimeFilter<"RevenueSubscription"> | Date | string
    updatedAt?: DateTimeFilter<"RevenueSubscription"> | Date | string
    payments?: FinancePaymentListRelationFilter
  }, "id">

  export type RevenueSubscriptionOrderByWithAggregationInput = {
    id?: SortOrder
    clientName?: SortOrder
    clientCompany?: SortOrderInput | SortOrder
    tool?: SortOrder
    planName?: SortOrder
    amountHT?: SortOrder
    vatAmount?: SortOrder
    amountTTC?: SortOrder
    frequency?: SortOrder
    status?: SortOrder
    trialStartAt?: SortOrderInput | SortOrder
    trialEndAt?: SortOrderInput | SortOrder
    startDate?: SortOrder
    nextInvoiceAt?: SortOrderInput | SortOrder
    nextPaymentAt?: SortOrderInput | SortOrder
    gocardlessCustomerId?: SortOrderInput | SortOrder
    gocardlessMandateId?: SortOrderInput | SortOrder
    gocardlessSubscriptionId?: SortOrderInput | SortOrder
    sageCustomerId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: RevenueSubscriptionCountOrderByAggregateInput
    _avg?: RevenueSubscriptionAvgOrderByAggregateInput
    _max?: RevenueSubscriptionMaxOrderByAggregateInput
    _min?: RevenueSubscriptionMinOrderByAggregateInput
    _sum?: RevenueSubscriptionSumOrderByAggregateInput
  }

  export type RevenueSubscriptionScalarWhereWithAggregatesInput = {
    AND?: RevenueSubscriptionScalarWhereWithAggregatesInput | RevenueSubscriptionScalarWhereWithAggregatesInput[]
    OR?: RevenueSubscriptionScalarWhereWithAggregatesInput[]
    NOT?: RevenueSubscriptionScalarWhereWithAggregatesInput | RevenueSubscriptionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"RevenueSubscription"> | string
    clientName?: StringWithAggregatesFilter<"RevenueSubscription"> | string
    clientCompany?: StringNullableWithAggregatesFilter<"RevenueSubscription"> | string | null
    tool?: EnumFinanceToolWithAggregatesFilter<"RevenueSubscription"> | $Enums.FinanceTool
    planName?: StringWithAggregatesFilter<"RevenueSubscription"> | string
    amountHT?: DecimalWithAggregatesFilter<"RevenueSubscription"> | Decimal | DecimalJsLike | number | string
    vatAmount?: DecimalWithAggregatesFilter<"RevenueSubscription"> | Decimal | DecimalJsLike | number | string
    amountTTC?: DecimalWithAggregatesFilter<"RevenueSubscription"> | Decimal | DecimalJsLike | number | string
    frequency?: EnumFinanceFrequencyWithAggregatesFilter<"RevenueSubscription"> | $Enums.FinanceFrequency
    status?: EnumRevenueStatusWithAggregatesFilter<"RevenueSubscription"> | $Enums.RevenueStatus
    trialStartAt?: DateTimeNullableWithAggregatesFilter<"RevenueSubscription"> | Date | string | null
    trialEndAt?: DateTimeNullableWithAggregatesFilter<"RevenueSubscription"> | Date | string | null
    startDate?: DateTimeWithAggregatesFilter<"RevenueSubscription"> | Date | string
    nextInvoiceAt?: DateTimeNullableWithAggregatesFilter<"RevenueSubscription"> | Date | string | null
    nextPaymentAt?: DateTimeNullableWithAggregatesFilter<"RevenueSubscription"> | Date | string | null
    gocardlessCustomerId?: StringNullableWithAggregatesFilter<"RevenueSubscription"> | string | null
    gocardlessMandateId?: StringNullableWithAggregatesFilter<"RevenueSubscription"> | string | null
    gocardlessSubscriptionId?: StringNullableWithAggregatesFilter<"RevenueSubscription"> | string | null
    sageCustomerId?: StringNullableWithAggregatesFilter<"RevenueSubscription"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"RevenueSubscription"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"RevenueSubscription"> | Date | string
  }

  export type FinanceInvoiceWhereInput = {
    AND?: FinanceInvoiceWhereInput | FinanceInvoiceWhereInput[]
    OR?: FinanceInvoiceWhereInput[]
    NOT?: FinanceInvoiceWhereInput | FinanceInvoiceWhereInput[]
    id?: StringFilter<"FinanceInvoice"> | string
    invoiceNumber?: StringFilter<"FinanceInvoice"> | string
    clientName?: StringFilter<"FinanceInvoice"> | string
    clientCompany?: StringNullableFilter<"FinanceInvoice"> | string | null
    tool?: EnumFinanceToolFilter<"FinanceInvoice"> | $Enums.FinanceTool
    amountHT?: DecimalFilter<"FinanceInvoice"> | Decimal | DecimalJsLike | number | string
    vatAmount?: DecimalFilter<"FinanceInvoice"> | Decimal | DecimalJsLike | number | string
    amountTTC?: DecimalFilter<"FinanceInvoice"> | Decimal | DecimalJsLike | number | string
    status?: EnumFinanceInvoiceStatusFilter<"FinanceInvoice"> | $Enums.FinanceInvoiceStatus
    issueDate?: DateTimeFilter<"FinanceInvoice"> | Date | string
    dueDate?: DateTimeNullableFilter<"FinanceInvoice"> | Date | string | null
    paidAt?: DateTimeNullableFilter<"FinanceInvoice"> | Date | string | null
    pdfUrl?: StringNullableFilter<"FinanceInvoice"> | string | null
    sageInvoiceId?: StringNullableFilter<"FinanceInvoice"> | string | null
    sageInvoiceStatus?: StringNullableFilter<"FinanceInvoice"> | string | null
    electronicInvoiceStatus?: EnumElectronicInvoiceStatusFilter<"FinanceInvoice"> | $Enums.ElectronicInvoiceStatus
    platformProvider?: StringNullableFilter<"FinanceInvoice"> | string | null
    platformInvoiceId?: StringNullableFilter<"FinanceInvoice"> | string | null
    createdAt?: DateTimeFilter<"FinanceInvoice"> | Date | string
    updatedAt?: DateTimeFilter<"FinanceInvoice"> | Date | string
    payments?: FinancePaymentListRelationFilter
  }

  export type FinanceInvoiceOrderByWithRelationInput = {
    id?: SortOrder
    invoiceNumber?: SortOrder
    clientName?: SortOrder
    clientCompany?: SortOrderInput | SortOrder
    tool?: SortOrder
    amountHT?: SortOrder
    vatAmount?: SortOrder
    amountTTC?: SortOrder
    status?: SortOrder
    issueDate?: SortOrder
    dueDate?: SortOrderInput | SortOrder
    paidAt?: SortOrderInput | SortOrder
    pdfUrl?: SortOrderInput | SortOrder
    sageInvoiceId?: SortOrderInput | SortOrder
    sageInvoiceStatus?: SortOrderInput | SortOrder
    electronicInvoiceStatus?: SortOrder
    platformProvider?: SortOrderInput | SortOrder
    platformInvoiceId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    payments?: FinancePaymentOrderByRelationAggregateInput
  }

  export type FinanceInvoiceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    invoiceNumber?: string
    AND?: FinanceInvoiceWhereInput | FinanceInvoiceWhereInput[]
    OR?: FinanceInvoiceWhereInput[]
    NOT?: FinanceInvoiceWhereInput | FinanceInvoiceWhereInput[]
    clientName?: StringFilter<"FinanceInvoice"> | string
    clientCompany?: StringNullableFilter<"FinanceInvoice"> | string | null
    tool?: EnumFinanceToolFilter<"FinanceInvoice"> | $Enums.FinanceTool
    amountHT?: DecimalFilter<"FinanceInvoice"> | Decimal | DecimalJsLike | number | string
    vatAmount?: DecimalFilter<"FinanceInvoice"> | Decimal | DecimalJsLike | number | string
    amountTTC?: DecimalFilter<"FinanceInvoice"> | Decimal | DecimalJsLike | number | string
    status?: EnumFinanceInvoiceStatusFilter<"FinanceInvoice"> | $Enums.FinanceInvoiceStatus
    issueDate?: DateTimeFilter<"FinanceInvoice"> | Date | string
    dueDate?: DateTimeNullableFilter<"FinanceInvoice"> | Date | string | null
    paidAt?: DateTimeNullableFilter<"FinanceInvoice"> | Date | string | null
    pdfUrl?: StringNullableFilter<"FinanceInvoice"> | string | null
    sageInvoiceId?: StringNullableFilter<"FinanceInvoice"> | string | null
    sageInvoiceStatus?: StringNullableFilter<"FinanceInvoice"> | string | null
    electronicInvoiceStatus?: EnumElectronicInvoiceStatusFilter<"FinanceInvoice"> | $Enums.ElectronicInvoiceStatus
    platformProvider?: StringNullableFilter<"FinanceInvoice"> | string | null
    platformInvoiceId?: StringNullableFilter<"FinanceInvoice"> | string | null
    createdAt?: DateTimeFilter<"FinanceInvoice"> | Date | string
    updatedAt?: DateTimeFilter<"FinanceInvoice"> | Date | string
    payments?: FinancePaymentListRelationFilter
  }, "id" | "invoiceNumber">

  export type FinanceInvoiceOrderByWithAggregationInput = {
    id?: SortOrder
    invoiceNumber?: SortOrder
    clientName?: SortOrder
    clientCompany?: SortOrderInput | SortOrder
    tool?: SortOrder
    amountHT?: SortOrder
    vatAmount?: SortOrder
    amountTTC?: SortOrder
    status?: SortOrder
    issueDate?: SortOrder
    dueDate?: SortOrderInput | SortOrder
    paidAt?: SortOrderInput | SortOrder
    pdfUrl?: SortOrderInput | SortOrder
    sageInvoiceId?: SortOrderInput | SortOrder
    sageInvoiceStatus?: SortOrderInput | SortOrder
    electronicInvoiceStatus?: SortOrder
    platformProvider?: SortOrderInput | SortOrder
    platformInvoiceId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: FinanceInvoiceCountOrderByAggregateInput
    _avg?: FinanceInvoiceAvgOrderByAggregateInput
    _max?: FinanceInvoiceMaxOrderByAggregateInput
    _min?: FinanceInvoiceMinOrderByAggregateInput
    _sum?: FinanceInvoiceSumOrderByAggregateInput
  }

  export type FinanceInvoiceScalarWhereWithAggregatesInput = {
    AND?: FinanceInvoiceScalarWhereWithAggregatesInput | FinanceInvoiceScalarWhereWithAggregatesInput[]
    OR?: FinanceInvoiceScalarWhereWithAggregatesInput[]
    NOT?: FinanceInvoiceScalarWhereWithAggregatesInput | FinanceInvoiceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"FinanceInvoice"> | string
    invoiceNumber?: StringWithAggregatesFilter<"FinanceInvoice"> | string
    clientName?: StringWithAggregatesFilter<"FinanceInvoice"> | string
    clientCompany?: StringNullableWithAggregatesFilter<"FinanceInvoice"> | string | null
    tool?: EnumFinanceToolWithAggregatesFilter<"FinanceInvoice"> | $Enums.FinanceTool
    amountHT?: DecimalWithAggregatesFilter<"FinanceInvoice"> | Decimal | DecimalJsLike | number | string
    vatAmount?: DecimalWithAggregatesFilter<"FinanceInvoice"> | Decimal | DecimalJsLike | number | string
    amountTTC?: DecimalWithAggregatesFilter<"FinanceInvoice"> | Decimal | DecimalJsLike | number | string
    status?: EnumFinanceInvoiceStatusWithAggregatesFilter<"FinanceInvoice"> | $Enums.FinanceInvoiceStatus
    issueDate?: DateTimeWithAggregatesFilter<"FinanceInvoice"> | Date | string
    dueDate?: DateTimeNullableWithAggregatesFilter<"FinanceInvoice"> | Date | string | null
    paidAt?: DateTimeNullableWithAggregatesFilter<"FinanceInvoice"> | Date | string | null
    pdfUrl?: StringNullableWithAggregatesFilter<"FinanceInvoice"> | string | null
    sageInvoiceId?: StringNullableWithAggregatesFilter<"FinanceInvoice"> | string | null
    sageInvoiceStatus?: StringNullableWithAggregatesFilter<"FinanceInvoice"> | string | null
    electronicInvoiceStatus?: EnumElectronicInvoiceStatusWithAggregatesFilter<"FinanceInvoice"> | $Enums.ElectronicInvoiceStatus
    platformProvider?: StringNullableWithAggregatesFilter<"FinanceInvoice"> | string | null
    platformInvoiceId?: StringNullableWithAggregatesFilter<"FinanceInvoice"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"FinanceInvoice"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"FinanceInvoice"> | Date | string
  }

  export type FinancePaymentWhereInput = {
    AND?: FinancePaymentWhereInput | FinancePaymentWhereInput[]
    OR?: FinancePaymentWhereInput[]
    NOT?: FinancePaymentWhereInput | FinancePaymentWhereInput[]
    id?: StringFilter<"FinancePayment"> | string
    invoiceId?: StringNullableFilter<"FinancePayment"> | string | null
    subscriptionId?: StringNullableFilter<"FinancePayment"> | string | null
    amount?: DecimalFilter<"FinancePayment"> | Decimal | DecimalJsLike | number | string
    status?: EnumFinancePaymentStatusFilter<"FinancePayment"> | $Enums.FinancePaymentStatus
    method?: StringNullableFilter<"FinancePayment"> | string | null
    gocardlessPaymentId?: StringNullableFilter<"FinancePayment"> | string | null
    paidAt?: DateTimeNullableFilter<"FinancePayment"> | Date | string | null
    failedAt?: DateTimeNullableFilter<"FinancePayment"> | Date | string | null
    failureReason?: StringNullableFilter<"FinancePayment"> | string | null
    createdAt?: DateTimeFilter<"FinancePayment"> | Date | string
    updatedAt?: DateTimeFilter<"FinancePayment"> | Date | string
    invoice?: XOR<FinanceInvoiceNullableScalarRelationFilter, FinanceInvoiceWhereInput> | null
    subscription?: XOR<RevenueSubscriptionNullableScalarRelationFilter, RevenueSubscriptionWhereInput> | null
  }

  export type FinancePaymentOrderByWithRelationInput = {
    id?: SortOrder
    invoiceId?: SortOrderInput | SortOrder
    subscriptionId?: SortOrderInput | SortOrder
    amount?: SortOrder
    status?: SortOrder
    method?: SortOrderInput | SortOrder
    gocardlessPaymentId?: SortOrderInput | SortOrder
    paidAt?: SortOrderInput | SortOrder
    failedAt?: SortOrderInput | SortOrder
    failureReason?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    invoice?: FinanceInvoiceOrderByWithRelationInput
    subscription?: RevenueSubscriptionOrderByWithRelationInput
  }

  export type FinancePaymentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: FinancePaymentWhereInput | FinancePaymentWhereInput[]
    OR?: FinancePaymentWhereInput[]
    NOT?: FinancePaymentWhereInput | FinancePaymentWhereInput[]
    invoiceId?: StringNullableFilter<"FinancePayment"> | string | null
    subscriptionId?: StringNullableFilter<"FinancePayment"> | string | null
    amount?: DecimalFilter<"FinancePayment"> | Decimal | DecimalJsLike | number | string
    status?: EnumFinancePaymentStatusFilter<"FinancePayment"> | $Enums.FinancePaymentStatus
    method?: StringNullableFilter<"FinancePayment"> | string | null
    gocardlessPaymentId?: StringNullableFilter<"FinancePayment"> | string | null
    paidAt?: DateTimeNullableFilter<"FinancePayment"> | Date | string | null
    failedAt?: DateTimeNullableFilter<"FinancePayment"> | Date | string | null
    failureReason?: StringNullableFilter<"FinancePayment"> | string | null
    createdAt?: DateTimeFilter<"FinancePayment"> | Date | string
    updatedAt?: DateTimeFilter<"FinancePayment"> | Date | string
    invoice?: XOR<FinanceInvoiceNullableScalarRelationFilter, FinanceInvoiceWhereInput> | null
    subscription?: XOR<RevenueSubscriptionNullableScalarRelationFilter, RevenueSubscriptionWhereInput> | null
  }, "id">

  export type FinancePaymentOrderByWithAggregationInput = {
    id?: SortOrder
    invoiceId?: SortOrderInput | SortOrder
    subscriptionId?: SortOrderInput | SortOrder
    amount?: SortOrder
    status?: SortOrder
    method?: SortOrderInput | SortOrder
    gocardlessPaymentId?: SortOrderInput | SortOrder
    paidAt?: SortOrderInput | SortOrder
    failedAt?: SortOrderInput | SortOrder
    failureReason?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: FinancePaymentCountOrderByAggregateInput
    _avg?: FinancePaymentAvgOrderByAggregateInput
    _max?: FinancePaymentMaxOrderByAggregateInput
    _min?: FinancePaymentMinOrderByAggregateInput
    _sum?: FinancePaymentSumOrderByAggregateInput
  }

  export type FinancePaymentScalarWhereWithAggregatesInput = {
    AND?: FinancePaymentScalarWhereWithAggregatesInput | FinancePaymentScalarWhereWithAggregatesInput[]
    OR?: FinancePaymentScalarWhereWithAggregatesInput[]
    NOT?: FinancePaymentScalarWhereWithAggregatesInput | FinancePaymentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"FinancePayment"> | string
    invoiceId?: StringNullableWithAggregatesFilter<"FinancePayment"> | string | null
    subscriptionId?: StringNullableWithAggregatesFilter<"FinancePayment"> | string | null
    amount?: DecimalWithAggregatesFilter<"FinancePayment"> | Decimal | DecimalJsLike | number | string
    status?: EnumFinancePaymentStatusWithAggregatesFilter<"FinancePayment"> | $Enums.FinancePaymentStatus
    method?: StringNullableWithAggregatesFilter<"FinancePayment"> | string | null
    gocardlessPaymentId?: StringNullableWithAggregatesFilter<"FinancePayment"> | string | null
    paidAt?: DateTimeNullableWithAggregatesFilter<"FinancePayment"> | Date | string | null
    failedAt?: DateTimeNullableWithAggregatesFilter<"FinancePayment"> | Date | string | null
    failureReason?: StringNullableWithAggregatesFilter<"FinancePayment"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"FinancePayment"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"FinancePayment"> | Date | string
  }

  export type AdminUserCreateInput = {
    id?: string
    email: string
    passwordHash: string
    nom: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AdminUserUncheckedCreateInput = {
    id?: string
    email: string
    passwordHash: string
    nom: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AdminUserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    nom?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminUserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    nom?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminUserCreateManyInput = {
    id?: string
    email: string
    passwordHash: string
    nom: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AdminUserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    nom?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminUserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    nom?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClientCreateInput = {
    id?: string
    nom: string
    email: string
    telephone?: string | null
    societe?: string | null
    outil?: string
    statut?: $Enums.ClientStatut
    abonnement?: string | null
    trialDebutAt?: Date | string | null
    trialFinAt?: Date | string | null
    abonnementActif?: boolean
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    acces?: AccesCreateNestedManyWithoutClientInput
    messages?: MessageCreateNestedManyWithoutClientInput
  }

  export type ClientUncheckedCreateInput = {
    id?: string
    nom: string
    email: string
    telephone?: string | null
    societe?: string | null
    outil?: string
    statut?: $Enums.ClientStatut
    abonnement?: string | null
    trialDebutAt?: Date | string | null
    trialFinAt?: Date | string | null
    abonnementActif?: boolean
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    acces?: AccesUncheckedCreateNestedManyWithoutClientInput
    messages?: MessageUncheckedCreateNestedManyWithoutClientInput
  }

  export type ClientUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nom?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    telephone?: NullableStringFieldUpdateOperationsInput | string | null
    societe?: NullableStringFieldUpdateOperationsInput | string | null
    outil?: StringFieldUpdateOperationsInput | string
    statut?: EnumClientStatutFieldUpdateOperationsInput | $Enums.ClientStatut
    abonnement?: NullableStringFieldUpdateOperationsInput | string | null
    trialDebutAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialFinAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    abonnementActif?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    acces?: AccesUpdateManyWithoutClientNestedInput
    messages?: MessageUpdateManyWithoutClientNestedInput
  }

  export type ClientUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nom?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    telephone?: NullableStringFieldUpdateOperationsInput | string | null
    societe?: NullableStringFieldUpdateOperationsInput | string | null
    outil?: StringFieldUpdateOperationsInput | string
    statut?: EnumClientStatutFieldUpdateOperationsInput | $Enums.ClientStatut
    abonnement?: NullableStringFieldUpdateOperationsInput | string | null
    trialDebutAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialFinAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    abonnementActif?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    acces?: AccesUncheckedUpdateManyWithoutClientNestedInput
    messages?: MessageUncheckedUpdateManyWithoutClientNestedInput
  }

  export type ClientCreateManyInput = {
    id?: string
    nom: string
    email: string
    telephone?: string | null
    societe?: string | null
    outil?: string
    statut?: $Enums.ClientStatut
    abonnement?: string | null
    trialDebutAt?: Date | string | null
    trialFinAt?: Date | string | null
    abonnementActif?: boolean
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ClientUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    nom?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    telephone?: NullableStringFieldUpdateOperationsInput | string | null
    societe?: NullableStringFieldUpdateOperationsInput | string | null
    outil?: StringFieldUpdateOperationsInput | string
    statut?: EnumClientStatutFieldUpdateOperationsInput | $Enums.ClientStatut
    abonnement?: NullableStringFieldUpdateOperationsInput | string | null
    trialDebutAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialFinAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    abonnementActif?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClientUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    nom?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    telephone?: NullableStringFieldUpdateOperationsInput | string | null
    societe?: NullableStringFieldUpdateOperationsInput | string | null
    outil?: StringFieldUpdateOperationsInput | string
    statut?: EnumClientStatutFieldUpdateOperationsInput | $Enums.ClientStatut
    abonnement?: NullableStringFieldUpdateOperationsInput | string | null
    trialDebutAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialFinAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    abonnementActif?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccesCreateInput = {
    id?: string
    email: string
    motDePasseTemp?: string | null
    actif?: boolean
    premiereConnexion?: boolean
    createdAt?: Date | string
    client: ClientCreateNestedOneWithoutAccesInput
  }

  export type AccesUncheckedCreateInput = {
    id?: string
    clientId: string
    email: string
    motDePasseTemp?: string | null
    actif?: boolean
    premiereConnexion?: boolean
    createdAt?: Date | string
  }

  export type AccesUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    motDePasseTemp?: NullableStringFieldUpdateOperationsInput | string | null
    actif?: BoolFieldUpdateOperationsInput | boolean
    premiereConnexion?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    client?: ClientUpdateOneRequiredWithoutAccesNestedInput
  }

  export type AccesUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    clientId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    motDePasseTemp?: NullableStringFieldUpdateOperationsInput | string | null
    actif?: BoolFieldUpdateOperationsInput | boolean
    premiereConnexion?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccesCreateManyInput = {
    id?: string
    clientId: string
    email: string
    motDePasseTemp?: string | null
    actif?: boolean
    premiereConnexion?: boolean
    createdAt?: Date | string
  }

  export type AccesUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    motDePasseTemp?: NullableStringFieldUpdateOperationsInput | string | null
    actif?: BoolFieldUpdateOperationsInput | boolean
    premiereConnexion?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccesUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    clientId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    motDePasseTemp?: NullableStringFieldUpdateOperationsInput | string | null
    actif?: BoolFieldUpdateOperationsInput | boolean
    premiereConnexion?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageCreateInput = {
    id?: string
    nom: string
    email: string
    societe?: string | null
    telephone?: string | null
    outil?: string
    message: string
    statut?: $Enums.MessageStatut
    reponse?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    client?: ClientCreateNestedOneWithoutMessagesInput
  }

  export type MessageUncheckedCreateInput = {
    id?: string
    clientId?: string | null
    nom: string
    email: string
    societe?: string | null
    telephone?: string | null
    outil?: string
    message: string
    statut?: $Enums.MessageStatut
    reponse?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MessageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nom?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    societe?: NullableStringFieldUpdateOperationsInput | string | null
    telephone?: NullableStringFieldUpdateOperationsInput | string | null
    outil?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    statut?: EnumMessageStatutFieldUpdateOperationsInput | $Enums.MessageStatut
    reponse?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    client?: ClientUpdateOneWithoutMessagesNestedInput
  }

  export type MessageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    clientId?: NullableStringFieldUpdateOperationsInput | string | null
    nom?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    societe?: NullableStringFieldUpdateOperationsInput | string | null
    telephone?: NullableStringFieldUpdateOperationsInput | string | null
    outil?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    statut?: EnumMessageStatutFieldUpdateOperationsInput | $Enums.MessageStatut
    reponse?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageCreateManyInput = {
    id?: string
    clientId?: string | null
    nom: string
    email: string
    societe?: string | null
    telephone?: string | null
    outil?: string
    message: string
    statut?: $Enums.MessageStatut
    reponse?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MessageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    nom?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    societe?: NullableStringFieldUpdateOperationsInput | string | null
    telephone?: NullableStringFieldUpdateOperationsInput | string | null
    outil?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    statut?: EnumMessageStatutFieldUpdateOperationsInput | $Enums.MessageStatut
    reponse?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    clientId?: NullableStringFieldUpdateOperationsInput | string | null
    nom?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    societe?: NullableStringFieldUpdateOperationsInput | string | null
    telephone?: NullableStringFieldUpdateOperationsInput | string | null
    outil?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    statut?: EnumMessageStatutFieldUpdateOperationsInput | $Enums.MessageStatut
    reponse?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogCreateInput = {
    id?: string
    outil: string
    cibleType: string
    cibleId?: string | null
    action: string
    statut?: string
    acteurId?: string | null
    acteurEmail?: string | null
    resume?: string | null
    avant?: NullableJsonNullValueInput | InputJsonValue
    apres?: NullableJsonNullValueInput | InputJsonValue
    erreur?: string | null
    createdAt?: Date | string
  }

  export type AuditLogUncheckedCreateInput = {
    id?: string
    outil: string
    cibleType: string
    cibleId?: string | null
    action: string
    statut?: string
    acteurId?: string | null
    acteurEmail?: string | null
    resume?: string | null
    avant?: NullableJsonNullValueInput | InputJsonValue
    apres?: NullableJsonNullValueInput | InputJsonValue
    erreur?: string | null
    createdAt?: Date | string
  }

  export type AuditLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    outil?: StringFieldUpdateOperationsInput | string
    cibleType?: StringFieldUpdateOperationsInput | string
    cibleId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    statut?: StringFieldUpdateOperationsInput | string
    acteurId?: NullableStringFieldUpdateOperationsInput | string | null
    acteurEmail?: NullableStringFieldUpdateOperationsInput | string | null
    resume?: NullableStringFieldUpdateOperationsInput | string | null
    avant?: NullableJsonNullValueInput | InputJsonValue
    apres?: NullableJsonNullValueInput | InputJsonValue
    erreur?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    outil?: StringFieldUpdateOperationsInput | string
    cibleType?: StringFieldUpdateOperationsInput | string
    cibleId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    statut?: StringFieldUpdateOperationsInput | string
    acteurId?: NullableStringFieldUpdateOperationsInput | string | null
    acteurEmail?: NullableStringFieldUpdateOperationsInput | string | null
    resume?: NullableStringFieldUpdateOperationsInput | string | null
    avant?: NullableJsonNullValueInput | InputJsonValue
    apres?: NullableJsonNullValueInput | InputJsonValue
    erreur?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogCreateManyInput = {
    id?: string
    outil: string
    cibleType: string
    cibleId?: string | null
    action: string
    statut?: string
    acteurId?: string | null
    acteurEmail?: string | null
    resume?: string | null
    avant?: NullableJsonNullValueInput | InputJsonValue
    apres?: NullableJsonNullValueInput | InputJsonValue
    erreur?: string | null
    createdAt?: Date | string
  }

  export type AuditLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    outil?: StringFieldUpdateOperationsInput | string
    cibleType?: StringFieldUpdateOperationsInput | string
    cibleId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    statut?: StringFieldUpdateOperationsInput | string
    acteurId?: NullableStringFieldUpdateOperationsInput | string | null
    acteurEmail?: NullableStringFieldUpdateOperationsInput | string | null
    resume?: NullableStringFieldUpdateOperationsInput | string | null
    avant?: NullableJsonNullValueInput | InputJsonValue
    apres?: NullableJsonNullValueInput | InputJsonValue
    erreur?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    outil?: StringFieldUpdateOperationsInput | string
    cibleType?: StringFieldUpdateOperationsInput | string
    cibleId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    statut?: StringFieldUpdateOperationsInput | string
    acteurId?: NullableStringFieldUpdateOperationsInput | string | null
    acteurEmail?: NullableStringFieldUpdateOperationsInput | string | null
    resume?: NullableStringFieldUpdateOperationsInput | string | null
    avant?: NullableJsonNullValueInput | InputJsonValue
    apres?: NullableJsonNullValueInput | InputJsonValue
    erreur?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ErrorReportCreateInput = {
    id?: string
    outil: string
    niveau?: string
    message: string
    stack?: string | null
    url?: string | null
    userAgent?: string | null
    contexte?: NullableJsonNullValueInput | InputJsonValue
    statut?: string
    notes?: string | null
    resolution?: string | null
    resolvedAt?: Date | string | null
    resolvedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ErrorReportUncheckedCreateInput = {
    id?: string
    outil: string
    niveau?: string
    message: string
    stack?: string | null
    url?: string | null
    userAgent?: string | null
    contexte?: NullableJsonNullValueInput | InputJsonValue
    statut?: string
    notes?: string | null
    resolution?: string | null
    resolvedAt?: Date | string | null
    resolvedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ErrorReportUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    outil?: StringFieldUpdateOperationsInput | string
    niveau?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    stack?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    contexte?: NullableJsonNullValueInput | InputJsonValue
    statut?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    resolution?: NullableStringFieldUpdateOperationsInput | string | null
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ErrorReportUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    outil?: StringFieldUpdateOperationsInput | string
    niveau?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    stack?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    contexte?: NullableJsonNullValueInput | InputJsonValue
    statut?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    resolution?: NullableStringFieldUpdateOperationsInput | string | null
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ErrorReportCreateManyInput = {
    id?: string
    outil: string
    niveau?: string
    message: string
    stack?: string | null
    url?: string | null
    userAgent?: string | null
    contexte?: NullableJsonNullValueInput | InputJsonValue
    statut?: string
    notes?: string | null
    resolution?: string | null
    resolvedAt?: Date | string | null
    resolvedBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ErrorReportUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    outil?: StringFieldUpdateOperationsInput | string
    niveau?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    stack?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    contexte?: NullableJsonNullValueInput | InputJsonValue
    statut?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    resolution?: NullableStringFieldUpdateOperationsInput | string | null
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ErrorReportUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    outil?: StringFieldUpdateOperationsInput | string
    niveau?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    stack?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    contexte?: NullableJsonNullValueInput | InputJsonValue
    statut?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    resolution?: NullableStringFieldUpdateOperationsInput | string | null
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    resolvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FinanceSettingsCreateInput = {
    id?: string
    urssafRate?: Decimal | DecimalJsLike | number | string
    vatRate?: Decimal | DecimalJsLike | number | string
    vatStatus?: $Enums.FinanceVatStatus
    declarationFrequency?: $Enums.FinanceDeclarationFrequency
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FinanceSettingsUncheckedCreateInput = {
    id?: string
    urssafRate?: Decimal | DecimalJsLike | number | string
    vatRate?: Decimal | DecimalJsLike | number | string
    vatStatus?: $Enums.FinanceVatStatus
    declarationFrequency?: $Enums.FinanceDeclarationFrequency
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FinanceSettingsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    urssafRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    vatRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    vatStatus?: EnumFinanceVatStatusFieldUpdateOperationsInput | $Enums.FinanceVatStatus
    declarationFrequency?: EnumFinanceDeclarationFrequencyFieldUpdateOperationsInput | $Enums.FinanceDeclarationFrequency
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FinanceSettingsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    urssafRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    vatRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    vatStatus?: EnumFinanceVatStatusFieldUpdateOperationsInput | $Enums.FinanceVatStatus
    declarationFrequency?: EnumFinanceDeclarationFrequencyFieldUpdateOperationsInput | $Enums.FinanceDeclarationFrequency
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FinanceSettingsCreateManyInput = {
    id?: string
    urssafRate?: Decimal | DecimalJsLike | number | string
    vatRate?: Decimal | DecimalJsLike | number | string
    vatStatus?: $Enums.FinanceVatStatus
    declarationFrequency?: $Enums.FinanceDeclarationFrequency
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FinanceSettingsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    urssafRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    vatRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    vatStatus?: EnumFinanceVatStatusFieldUpdateOperationsInput | $Enums.FinanceVatStatus
    declarationFrequency?: EnumFinanceDeclarationFrequencyFieldUpdateOperationsInput | $Enums.FinanceDeclarationFrequency
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FinanceSettingsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    urssafRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    vatRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    vatStatus?: EnumFinanceVatStatusFieldUpdateOperationsInput | $Enums.FinanceVatStatus
    declarationFrequency?: EnumFinanceDeclarationFrequencyFieldUpdateOperationsInput | $Enums.FinanceDeclarationFrequency
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LysmaExpenseCreateInput = {
    id?: string
    name: string
    provider: string
    category?: $Enums.ExpenseCategory
    relatedTool?: $Enums.FinanceTool
    amountHT: Decimal | DecimalJsLike | number | string
    vatAmount?: Decimal | DecimalJsLike | number | string
    amountTTC: Decimal | DecimalJsLike | number | string
    frequency?: $Enums.FinanceFrequency
    startDate: Date | string
    renewalDate?: Date | string | null
    paymentMethod?: string | null
    status?: $Enums.ExpenseStatus
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LysmaExpenseUncheckedCreateInput = {
    id?: string
    name: string
    provider: string
    category?: $Enums.ExpenseCategory
    relatedTool?: $Enums.FinanceTool
    amountHT: Decimal | DecimalJsLike | number | string
    vatAmount?: Decimal | DecimalJsLike | number | string
    amountTTC: Decimal | DecimalJsLike | number | string
    frequency?: $Enums.FinanceFrequency
    startDate: Date | string
    renewalDate?: Date | string | null
    paymentMethod?: string | null
    status?: $Enums.ExpenseStatus
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LysmaExpenseUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    category?: EnumExpenseCategoryFieldUpdateOperationsInput | $Enums.ExpenseCategory
    relatedTool?: EnumFinanceToolFieldUpdateOperationsInput | $Enums.FinanceTool
    amountHT?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    vatAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    amountTTC?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    frequency?: EnumFinanceFrequencyFieldUpdateOperationsInput | $Enums.FinanceFrequency
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    renewalDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    paymentMethod?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumExpenseStatusFieldUpdateOperationsInput | $Enums.ExpenseStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LysmaExpenseUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    category?: EnumExpenseCategoryFieldUpdateOperationsInput | $Enums.ExpenseCategory
    relatedTool?: EnumFinanceToolFieldUpdateOperationsInput | $Enums.FinanceTool
    amountHT?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    vatAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    amountTTC?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    frequency?: EnumFinanceFrequencyFieldUpdateOperationsInput | $Enums.FinanceFrequency
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    renewalDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    paymentMethod?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumExpenseStatusFieldUpdateOperationsInput | $Enums.ExpenseStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LysmaExpenseCreateManyInput = {
    id?: string
    name: string
    provider: string
    category?: $Enums.ExpenseCategory
    relatedTool?: $Enums.FinanceTool
    amountHT: Decimal | DecimalJsLike | number | string
    vatAmount?: Decimal | DecimalJsLike | number | string
    amountTTC: Decimal | DecimalJsLike | number | string
    frequency?: $Enums.FinanceFrequency
    startDate: Date | string
    renewalDate?: Date | string | null
    paymentMethod?: string | null
    status?: $Enums.ExpenseStatus
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LysmaExpenseUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    category?: EnumExpenseCategoryFieldUpdateOperationsInput | $Enums.ExpenseCategory
    relatedTool?: EnumFinanceToolFieldUpdateOperationsInput | $Enums.FinanceTool
    amountHT?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    vatAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    amountTTC?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    frequency?: EnumFinanceFrequencyFieldUpdateOperationsInput | $Enums.FinanceFrequency
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    renewalDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    paymentMethod?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumExpenseStatusFieldUpdateOperationsInput | $Enums.ExpenseStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LysmaExpenseUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    category?: EnumExpenseCategoryFieldUpdateOperationsInput | $Enums.ExpenseCategory
    relatedTool?: EnumFinanceToolFieldUpdateOperationsInput | $Enums.FinanceTool
    amountHT?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    vatAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    amountTTC?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    frequency?: EnumFinanceFrequencyFieldUpdateOperationsInput | $Enums.FinanceFrequency
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    renewalDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    paymentMethod?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumExpenseStatusFieldUpdateOperationsInput | $Enums.ExpenseStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RevenueSubscriptionCreateInput = {
    id?: string
    clientName: string
    clientCompany?: string | null
    tool: $Enums.FinanceTool
    planName: string
    amountHT: Decimal | DecimalJsLike | number | string
    vatAmount?: Decimal | DecimalJsLike | number | string
    amountTTC: Decimal | DecimalJsLike | number | string
    frequency?: $Enums.FinanceFrequency
    status?: $Enums.RevenueStatus
    trialStartAt?: Date | string | null
    trialEndAt?: Date | string | null
    startDate: Date | string
    nextInvoiceAt?: Date | string | null
    nextPaymentAt?: Date | string | null
    gocardlessCustomerId?: string | null
    gocardlessMandateId?: string | null
    gocardlessSubscriptionId?: string | null
    sageCustomerId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    payments?: FinancePaymentCreateNestedManyWithoutSubscriptionInput
  }

  export type RevenueSubscriptionUncheckedCreateInput = {
    id?: string
    clientName: string
    clientCompany?: string | null
    tool: $Enums.FinanceTool
    planName: string
    amountHT: Decimal | DecimalJsLike | number | string
    vatAmount?: Decimal | DecimalJsLike | number | string
    amountTTC: Decimal | DecimalJsLike | number | string
    frequency?: $Enums.FinanceFrequency
    status?: $Enums.RevenueStatus
    trialStartAt?: Date | string | null
    trialEndAt?: Date | string | null
    startDate: Date | string
    nextInvoiceAt?: Date | string | null
    nextPaymentAt?: Date | string | null
    gocardlessCustomerId?: string | null
    gocardlessMandateId?: string | null
    gocardlessSubscriptionId?: string | null
    sageCustomerId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    payments?: FinancePaymentUncheckedCreateNestedManyWithoutSubscriptionInput
  }

  export type RevenueSubscriptionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    clientName?: StringFieldUpdateOperationsInput | string
    clientCompany?: NullableStringFieldUpdateOperationsInput | string | null
    tool?: EnumFinanceToolFieldUpdateOperationsInput | $Enums.FinanceTool
    planName?: StringFieldUpdateOperationsInput | string
    amountHT?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    vatAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    amountTTC?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    frequency?: EnumFinanceFrequencyFieldUpdateOperationsInput | $Enums.FinanceFrequency
    status?: EnumRevenueStatusFieldUpdateOperationsInput | $Enums.RevenueStatus
    trialStartAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialEndAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    nextInvoiceAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextPaymentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gocardlessCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    gocardlessMandateId?: NullableStringFieldUpdateOperationsInput | string | null
    gocardlessSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    sageCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    payments?: FinancePaymentUpdateManyWithoutSubscriptionNestedInput
  }

  export type RevenueSubscriptionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    clientName?: StringFieldUpdateOperationsInput | string
    clientCompany?: NullableStringFieldUpdateOperationsInput | string | null
    tool?: EnumFinanceToolFieldUpdateOperationsInput | $Enums.FinanceTool
    planName?: StringFieldUpdateOperationsInput | string
    amountHT?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    vatAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    amountTTC?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    frequency?: EnumFinanceFrequencyFieldUpdateOperationsInput | $Enums.FinanceFrequency
    status?: EnumRevenueStatusFieldUpdateOperationsInput | $Enums.RevenueStatus
    trialStartAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialEndAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    nextInvoiceAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextPaymentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gocardlessCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    gocardlessMandateId?: NullableStringFieldUpdateOperationsInput | string | null
    gocardlessSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    sageCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    payments?: FinancePaymentUncheckedUpdateManyWithoutSubscriptionNestedInput
  }

  export type RevenueSubscriptionCreateManyInput = {
    id?: string
    clientName: string
    clientCompany?: string | null
    tool: $Enums.FinanceTool
    planName: string
    amountHT: Decimal | DecimalJsLike | number | string
    vatAmount?: Decimal | DecimalJsLike | number | string
    amountTTC: Decimal | DecimalJsLike | number | string
    frequency?: $Enums.FinanceFrequency
    status?: $Enums.RevenueStatus
    trialStartAt?: Date | string | null
    trialEndAt?: Date | string | null
    startDate: Date | string
    nextInvoiceAt?: Date | string | null
    nextPaymentAt?: Date | string | null
    gocardlessCustomerId?: string | null
    gocardlessMandateId?: string | null
    gocardlessSubscriptionId?: string | null
    sageCustomerId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RevenueSubscriptionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    clientName?: StringFieldUpdateOperationsInput | string
    clientCompany?: NullableStringFieldUpdateOperationsInput | string | null
    tool?: EnumFinanceToolFieldUpdateOperationsInput | $Enums.FinanceTool
    planName?: StringFieldUpdateOperationsInput | string
    amountHT?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    vatAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    amountTTC?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    frequency?: EnumFinanceFrequencyFieldUpdateOperationsInput | $Enums.FinanceFrequency
    status?: EnumRevenueStatusFieldUpdateOperationsInput | $Enums.RevenueStatus
    trialStartAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialEndAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    nextInvoiceAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextPaymentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gocardlessCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    gocardlessMandateId?: NullableStringFieldUpdateOperationsInput | string | null
    gocardlessSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    sageCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RevenueSubscriptionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    clientName?: StringFieldUpdateOperationsInput | string
    clientCompany?: NullableStringFieldUpdateOperationsInput | string | null
    tool?: EnumFinanceToolFieldUpdateOperationsInput | $Enums.FinanceTool
    planName?: StringFieldUpdateOperationsInput | string
    amountHT?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    vatAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    amountTTC?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    frequency?: EnumFinanceFrequencyFieldUpdateOperationsInput | $Enums.FinanceFrequency
    status?: EnumRevenueStatusFieldUpdateOperationsInput | $Enums.RevenueStatus
    trialStartAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialEndAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    nextInvoiceAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextPaymentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gocardlessCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    gocardlessMandateId?: NullableStringFieldUpdateOperationsInput | string | null
    gocardlessSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    sageCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FinanceInvoiceCreateInput = {
    id?: string
    invoiceNumber: string
    clientName: string
    clientCompany?: string | null
    tool: $Enums.FinanceTool
    amountHT: Decimal | DecimalJsLike | number | string
    vatAmount?: Decimal | DecimalJsLike | number | string
    amountTTC: Decimal | DecimalJsLike | number | string
    status?: $Enums.FinanceInvoiceStatus
    issueDate: Date | string
    dueDate?: Date | string | null
    paidAt?: Date | string | null
    pdfUrl?: string | null
    sageInvoiceId?: string | null
    sageInvoiceStatus?: string | null
    electronicInvoiceStatus?: $Enums.ElectronicInvoiceStatus
    platformProvider?: string | null
    platformInvoiceId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    payments?: FinancePaymentCreateNestedManyWithoutInvoiceInput
  }

  export type FinanceInvoiceUncheckedCreateInput = {
    id?: string
    invoiceNumber: string
    clientName: string
    clientCompany?: string | null
    tool: $Enums.FinanceTool
    amountHT: Decimal | DecimalJsLike | number | string
    vatAmount?: Decimal | DecimalJsLike | number | string
    amountTTC: Decimal | DecimalJsLike | number | string
    status?: $Enums.FinanceInvoiceStatus
    issueDate: Date | string
    dueDate?: Date | string | null
    paidAt?: Date | string | null
    pdfUrl?: string | null
    sageInvoiceId?: string | null
    sageInvoiceStatus?: string | null
    electronicInvoiceStatus?: $Enums.ElectronicInvoiceStatus
    platformProvider?: string | null
    platformInvoiceId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    payments?: FinancePaymentUncheckedCreateNestedManyWithoutInvoiceInput
  }

  export type FinanceInvoiceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    clientName?: StringFieldUpdateOperationsInput | string
    clientCompany?: NullableStringFieldUpdateOperationsInput | string | null
    tool?: EnumFinanceToolFieldUpdateOperationsInput | $Enums.FinanceTool
    amountHT?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    vatAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    amountTTC?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumFinanceInvoiceStatusFieldUpdateOperationsInput | $Enums.FinanceInvoiceStatus
    issueDate?: DateTimeFieldUpdateOperationsInput | Date | string
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    pdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    sageInvoiceId?: NullableStringFieldUpdateOperationsInput | string | null
    sageInvoiceStatus?: NullableStringFieldUpdateOperationsInput | string | null
    electronicInvoiceStatus?: EnumElectronicInvoiceStatusFieldUpdateOperationsInput | $Enums.ElectronicInvoiceStatus
    platformProvider?: NullableStringFieldUpdateOperationsInput | string | null
    platformInvoiceId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    payments?: FinancePaymentUpdateManyWithoutInvoiceNestedInput
  }

  export type FinanceInvoiceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    clientName?: StringFieldUpdateOperationsInput | string
    clientCompany?: NullableStringFieldUpdateOperationsInput | string | null
    tool?: EnumFinanceToolFieldUpdateOperationsInput | $Enums.FinanceTool
    amountHT?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    vatAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    amountTTC?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumFinanceInvoiceStatusFieldUpdateOperationsInput | $Enums.FinanceInvoiceStatus
    issueDate?: DateTimeFieldUpdateOperationsInput | Date | string
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    pdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    sageInvoiceId?: NullableStringFieldUpdateOperationsInput | string | null
    sageInvoiceStatus?: NullableStringFieldUpdateOperationsInput | string | null
    electronicInvoiceStatus?: EnumElectronicInvoiceStatusFieldUpdateOperationsInput | $Enums.ElectronicInvoiceStatus
    platformProvider?: NullableStringFieldUpdateOperationsInput | string | null
    platformInvoiceId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    payments?: FinancePaymentUncheckedUpdateManyWithoutInvoiceNestedInput
  }

  export type FinanceInvoiceCreateManyInput = {
    id?: string
    invoiceNumber: string
    clientName: string
    clientCompany?: string | null
    tool: $Enums.FinanceTool
    amountHT: Decimal | DecimalJsLike | number | string
    vatAmount?: Decimal | DecimalJsLike | number | string
    amountTTC: Decimal | DecimalJsLike | number | string
    status?: $Enums.FinanceInvoiceStatus
    issueDate: Date | string
    dueDate?: Date | string | null
    paidAt?: Date | string | null
    pdfUrl?: string | null
    sageInvoiceId?: string | null
    sageInvoiceStatus?: string | null
    electronicInvoiceStatus?: $Enums.ElectronicInvoiceStatus
    platformProvider?: string | null
    platformInvoiceId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FinanceInvoiceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    clientName?: StringFieldUpdateOperationsInput | string
    clientCompany?: NullableStringFieldUpdateOperationsInput | string | null
    tool?: EnumFinanceToolFieldUpdateOperationsInput | $Enums.FinanceTool
    amountHT?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    vatAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    amountTTC?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumFinanceInvoiceStatusFieldUpdateOperationsInput | $Enums.FinanceInvoiceStatus
    issueDate?: DateTimeFieldUpdateOperationsInput | Date | string
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    pdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    sageInvoiceId?: NullableStringFieldUpdateOperationsInput | string | null
    sageInvoiceStatus?: NullableStringFieldUpdateOperationsInput | string | null
    electronicInvoiceStatus?: EnumElectronicInvoiceStatusFieldUpdateOperationsInput | $Enums.ElectronicInvoiceStatus
    platformProvider?: NullableStringFieldUpdateOperationsInput | string | null
    platformInvoiceId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FinanceInvoiceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    clientName?: StringFieldUpdateOperationsInput | string
    clientCompany?: NullableStringFieldUpdateOperationsInput | string | null
    tool?: EnumFinanceToolFieldUpdateOperationsInput | $Enums.FinanceTool
    amountHT?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    vatAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    amountTTC?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumFinanceInvoiceStatusFieldUpdateOperationsInput | $Enums.FinanceInvoiceStatus
    issueDate?: DateTimeFieldUpdateOperationsInput | Date | string
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    pdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    sageInvoiceId?: NullableStringFieldUpdateOperationsInput | string | null
    sageInvoiceStatus?: NullableStringFieldUpdateOperationsInput | string | null
    electronicInvoiceStatus?: EnumElectronicInvoiceStatusFieldUpdateOperationsInput | $Enums.ElectronicInvoiceStatus
    platformProvider?: NullableStringFieldUpdateOperationsInput | string | null
    platformInvoiceId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FinancePaymentCreateInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    status?: $Enums.FinancePaymentStatus
    method?: string | null
    gocardlessPaymentId?: string | null
    paidAt?: Date | string | null
    failedAt?: Date | string | null
    failureReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    invoice?: FinanceInvoiceCreateNestedOneWithoutPaymentsInput
    subscription?: RevenueSubscriptionCreateNestedOneWithoutPaymentsInput
  }

  export type FinancePaymentUncheckedCreateInput = {
    id?: string
    invoiceId?: string | null
    subscriptionId?: string | null
    amount: Decimal | DecimalJsLike | number | string
    status?: $Enums.FinancePaymentStatus
    method?: string | null
    gocardlessPaymentId?: string | null
    paidAt?: Date | string | null
    failedAt?: Date | string | null
    failureReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FinancePaymentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumFinancePaymentStatusFieldUpdateOperationsInput | $Enums.FinancePaymentStatus
    method?: NullableStringFieldUpdateOperationsInput | string | null
    gocardlessPaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoice?: FinanceInvoiceUpdateOneWithoutPaymentsNestedInput
    subscription?: RevenueSubscriptionUpdateOneWithoutPaymentsNestedInput
  }

  export type FinancePaymentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceId?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumFinancePaymentStatusFieldUpdateOperationsInput | $Enums.FinancePaymentStatus
    method?: NullableStringFieldUpdateOperationsInput | string | null
    gocardlessPaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FinancePaymentCreateManyInput = {
    id?: string
    invoiceId?: string | null
    subscriptionId?: string | null
    amount: Decimal | DecimalJsLike | number | string
    status?: $Enums.FinancePaymentStatus
    method?: string | null
    gocardlessPaymentId?: string | null
    paidAt?: Date | string | null
    failedAt?: Date | string | null
    failureReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FinancePaymentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumFinancePaymentStatusFieldUpdateOperationsInput | $Enums.FinancePaymentStatus
    method?: NullableStringFieldUpdateOperationsInput | string | null
    gocardlessPaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FinancePaymentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceId?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumFinancePaymentStatusFieldUpdateOperationsInput | $Enums.FinancePaymentStatus
    method?: NullableStringFieldUpdateOperationsInput | string | null
    gocardlessPaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type AdminUserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    nom?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AdminUserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    nom?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AdminUserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    nom?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type EnumClientStatutFilter<$PrismaModel = never> = {
    equals?: $Enums.ClientStatut | EnumClientStatutFieldRefInput<$PrismaModel>
    in?: $Enums.ClientStatut[] | ListEnumClientStatutFieldRefInput<$PrismaModel>
    notIn?: $Enums.ClientStatut[] | ListEnumClientStatutFieldRefInput<$PrismaModel>
    not?: NestedEnumClientStatutFilter<$PrismaModel> | $Enums.ClientStatut
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type AccesListRelationFilter = {
    every?: AccesWhereInput
    some?: AccesWhereInput
    none?: AccesWhereInput
  }

  export type MessageListRelationFilter = {
    every?: MessageWhereInput
    some?: MessageWhereInput
    none?: MessageWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type AccesOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MessageOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ClientCountOrderByAggregateInput = {
    id?: SortOrder
    nom?: SortOrder
    email?: SortOrder
    telephone?: SortOrder
    societe?: SortOrder
    outil?: SortOrder
    statut?: SortOrder
    abonnement?: SortOrder
    trialDebutAt?: SortOrder
    trialFinAt?: SortOrder
    abonnementActif?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ClientMaxOrderByAggregateInput = {
    id?: SortOrder
    nom?: SortOrder
    email?: SortOrder
    telephone?: SortOrder
    societe?: SortOrder
    outil?: SortOrder
    statut?: SortOrder
    abonnement?: SortOrder
    trialDebutAt?: SortOrder
    trialFinAt?: SortOrder
    abonnementActif?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ClientMinOrderByAggregateInput = {
    id?: SortOrder
    nom?: SortOrder
    email?: SortOrder
    telephone?: SortOrder
    societe?: SortOrder
    outil?: SortOrder
    statut?: SortOrder
    abonnement?: SortOrder
    trialDebutAt?: SortOrder
    trialFinAt?: SortOrder
    abonnementActif?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumClientStatutWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ClientStatut | EnumClientStatutFieldRefInput<$PrismaModel>
    in?: $Enums.ClientStatut[] | ListEnumClientStatutFieldRefInput<$PrismaModel>
    notIn?: $Enums.ClientStatut[] | ListEnumClientStatutFieldRefInput<$PrismaModel>
    not?: NestedEnumClientStatutWithAggregatesFilter<$PrismaModel> | $Enums.ClientStatut
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumClientStatutFilter<$PrismaModel>
    _max?: NestedEnumClientStatutFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type ClientScalarRelationFilter = {
    is?: ClientWhereInput
    isNot?: ClientWhereInput
  }

  export type AccesCountOrderByAggregateInput = {
    id?: SortOrder
    clientId?: SortOrder
    email?: SortOrder
    motDePasseTemp?: SortOrder
    actif?: SortOrder
    premiereConnexion?: SortOrder
    createdAt?: SortOrder
  }

  export type AccesMaxOrderByAggregateInput = {
    id?: SortOrder
    clientId?: SortOrder
    email?: SortOrder
    motDePasseTemp?: SortOrder
    actif?: SortOrder
    premiereConnexion?: SortOrder
    createdAt?: SortOrder
  }

  export type AccesMinOrderByAggregateInput = {
    id?: SortOrder
    clientId?: SortOrder
    email?: SortOrder
    motDePasseTemp?: SortOrder
    actif?: SortOrder
    premiereConnexion?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumMessageStatutFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageStatut | EnumMessageStatutFieldRefInput<$PrismaModel>
    in?: $Enums.MessageStatut[] | ListEnumMessageStatutFieldRefInput<$PrismaModel>
    notIn?: $Enums.MessageStatut[] | ListEnumMessageStatutFieldRefInput<$PrismaModel>
    not?: NestedEnumMessageStatutFilter<$PrismaModel> | $Enums.MessageStatut
  }

  export type ClientNullableScalarRelationFilter = {
    is?: ClientWhereInput | null
    isNot?: ClientWhereInput | null
  }

  export type MessageCountOrderByAggregateInput = {
    id?: SortOrder
    clientId?: SortOrder
    nom?: SortOrder
    email?: SortOrder
    societe?: SortOrder
    telephone?: SortOrder
    outil?: SortOrder
    message?: SortOrder
    statut?: SortOrder
    reponse?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MessageMaxOrderByAggregateInput = {
    id?: SortOrder
    clientId?: SortOrder
    nom?: SortOrder
    email?: SortOrder
    societe?: SortOrder
    telephone?: SortOrder
    outil?: SortOrder
    message?: SortOrder
    statut?: SortOrder
    reponse?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MessageMinOrderByAggregateInput = {
    id?: SortOrder
    clientId?: SortOrder
    nom?: SortOrder
    email?: SortOrder
    societe?: SortOrder
    telephone?: SortOrder
    outil?: SortOrder
    message?: SortOrder
    statut?: SortOrder
    reponse?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumMessageStatutWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageStatut | EnumMessageStatutFieldRefInput<$PrismaModel>
    in?: $Enums.MessageStatut[] | ListEnumMessageStatutFieldRefInput<$PrismaModel>
    notIn?: $Enums.MessageStatut[] | ListEnumMessageStatutFieldRefInput<$PrismaModel>
    not?: NestedEnumMessageStatutWithAggregatesFilter<$PrismaModel> | $Enums.MessageStatut
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMessageStatutFilter<$PrismaModel>
    _max?: NestedEnumMessageStatutFilter<$PrismaModel>
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type AuditLogCountOrderByAggregateInput = {
    id?: SortOrder
    outil?: SortOrder
    cibleType?: SortOrder
    cibleId?: SortOrder
    action?: SortOrder
    statut?: SortOrder
    acteurId?: SortOrder
    acteurEmail?: SortOrder
    resume?: SortOrder
    avant?: SortOrder
    apres?: SortOrder
    erreur?: SortOrder
    createdAt?: SortOrder
  }

  export type AuditLogMaxOrderByAggregateInput = {
    id?: SortOrder
    outil?: SortOrder
    cibleType?: SortOrder
    cibleId?: SortOrder
    action?: SortOrder
    statut?: SortOrder
    acteurId?: SortOrder
    acteurEmail?: SortOrder
    resume?: SortOrder
    erreur?: SortOrder
    createdAt?: SortOrder
  }

  export type AuditLogMinOrderByAggregateInput = {
    id?: SortOrder
    outil?: SortOrder
    cibleType?: SortOrder
    cibleId?: SortOrder
    action?: SortOrder
    statut?: SortOrder
    acteurId?: SortOrder
    acteurEmail?: SortOrder
    resume?: SortOrder
    erreur?: SortOrder
    createdAt?: SortOrder
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type ErrorReportCountOrderByAggregateInput = {
    id?: SortOrder
    outil?: SortOrder
    niveau?: SortOrder
    message?: SortOrder
    stack?: SortOrder
    url?: SortOrder
    userAgent?: SortOrder
    contexte?: SortOrder
    statut?: SortOrder
    notes?: SortOrder
    resolution?: SortOrder
    resolvedAt?: SortOrder
    resolvedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ErrorReportMaxOrderByAggregateInput = {
    id?: SortOrder
    outil?: SortOrder
    niveau?: SortOrder
    message?: SortOrder
    stack?: SortOrder
    url?: SortOrder
    userAgent?: SortOrder
    statut?: SortOrder
    notes?: SortOrder
    resolution?: SortOrder
    resolvedAt?: SortOrder
    resolvedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ErrorReportMinOrderByAggregateInput = {
    id?: SortOrder
    outil?: SortOrder
    niveau?: SortOrder
    message?: SortOrder
    stack?: SortOrder
    url?: SortOrder
    userAgent?: SortOrder
    statut?: SortOrder
    notes?: SortOrder
    resolution?: SortOrder
    resolvedAt?: SortOrder
    resolvedBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type EnumFinanceVatStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.FinanceVatStatus | EnumFinanceVatStatusFieldRefInput<$PrismaModel>
    in?: $Enums.FinanceVatStatus[] | ListEnumFinanceVatStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.FinanceVatStatus[] | ListEnumFinanceVatStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumFinanceVatStatusFilter<$PrismaModel> | $Enums.FinanceVatStatus
  }

  export type EnumFinanceDeclarationFrequencyFilter<$PrismaModel = never> = {
    equals?: $Enums.FinanceDeclarationFrequency | EnumFinanceDeclarationFrequencyFieldRefInput<$PrismaModel>
    in?: $Enums.FinanceDeclarationFrequency[] | ListEnumFinanceDeclarationFrequencyFieldRefInput<$PrismaModel>
    notIn?: $Enums.FinanceDeclarationFrequency[] | ListEnumFinanceDeclarationFrequencyFieldRefInput<$PrismaModel>
    not?: NestedEnumFinanceDeclarationFrequencyFilter<$PrismaModel> | $Enums.FinanceDeclarationFrequency
  }

  export type FinanceSettingsCountOrderByAggregateInput = {
    id?: SortOrder
    urssafRate?: SortOrder
    vatRate?: SortOrder
    vatStatus?: SortOrder
    declarationFrequency?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FinanceSettingsAvgOrderByAggregateInput = {
    urssafRate?: SortOrder
    vatRate?: SortOrder
  }

  export type FinanceSettingsMaxOrderByAggregateInput = {
    id?: SortOrder
    urssafRate?: SortOrder
    vatRate?: SortOrder
    vatStatus?: SortOrder
    declarationFrequency?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FinanceSettingsMinOrderByAggregateInput = {
    id?: SortOrder
    urssafRate?: SortOrder
    vatRate?: SortOrder
    vatStatus?: SortOrder
    declarationFrequency?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FinanceSettingsSumOrderByAggregateInput = {
    urssafRate?: SortOrder
    vatRate?: SortOrder
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type EnumFinanceVatStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FinanceVatStatus | EnumFinanceVatStatusFieldRefInput<$PrismaModel>
    in?: $Enums.FinanceVatStatus[] | ListEnumFinanceVatStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.FinanceVatStatus[] | ListEnumFinanceVatStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumFinanceVatStatusWithAggregatesFilter<$PrismaModel> | $Enums.FinanceVatStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFinanceVatStatusFilter<$PrismaModel>
    _max?: NestedEnumFinanceVatStatusFilter<$PrismaModel>
  }

  export type EnumFinanceDeclarationFrequencyWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FinanceDeclarationFrequency | EnumFinanceDeclarationFrequencyFieldRefInput<$PrismaModel>
    in?: $Enums.FinanceDeclarationFrequency[] | ListEnumFinanceDeclarationFrequencyFieldRefInput<$PrismaModel>
    notIn?: $Enums.FinanceDeclarationFrequency[] | ListEnumFinanceDeclarationFrequencyFieldRefInput<$PrismaModel>
    not?: NestedEnumFinanceDeclarationFrequencyWithAggregatesFilter<$PrismaModel> | $Enums.FinanceDeclarationFrequency
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFinanceDeclarationFrequencyFilter<$PrismaModel>
    _max?: NestedEnumFinanceDeclarationFrequencyFilter<$PrismaModel>
  }

  export type EnumExpenseCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.ExpenseCategory | EnumExpenseCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.ExpenseCategory[] | ListEnumExpenseCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.ExpenseCategory[] | ListEnumExpenseCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumExpenseCategoryFilter<$PrismaModel> | $Enums.ExpenseCategory
  }

  export type EnumFinanceToolFilter<$PrismaModel = never> = {
    equals?: $Enums.FinanceTool | EnumFinanceToolFieldRefInput<$PrismaModel>
    in?: $Enums.FinanceTool[] | ListEnumFinanceToolFieldRefInput<$PrismaModel>
    notIn?: $Enums.FinanceTool[] | ListEnumFinanceToolFieldRefInput<$PrismaModel>
    not?: NestedEnumFinanceToolFilter<$PrismaModel> | $Enums.FinanceTool
  }

  export type EnumFinanceFrequencyFilter<$PrismaModel = never> = {
    equals?: $Enums.FinanceFrequency | EnumFinanceFrequencyFieldRefInput<$PrismaModel>
    in?: $Enums.FinanceFrequency[] | ListEnumFinanceFrequencyFieldRefInput<$PrismaModel>
    notIn?: $Enums.FinanceFrequency[] | ListEnumFinanceFrequencyFieldRefInput<$PrismaModel>
    not?: NestedEnumFinanceFrequencyFilter<$PrismaModel> | $Enums.FinanceFrequency
  }

  export type EnumExpenseStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ExpenseStatus | EnumExpenseStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ExpenseStatus[] | ListEnumExpenseStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ExpenseStatus[] | ListEnumExpenseStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumExpenseStatusFilter<$PrismaModel> | $Enums.ExpenseStatus
  }

  export type LysmaExpenseCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    provider?: SortOrder
    category?: SortOrder
    relatedTool?: SortOrder
    amountHT?: SortOrder
    vatAmount?: SortOrder
    amountTTC?: SortOrder
    frequency?: SortOrder
    startDate?: SortOrder
    renewalDate?: SortOrder
    paymentMethod?: SortOrder
    status?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LysmaExpenseAvgOrderByAggregateInput = {
    amountHT?: SortOrder
    vatAmount?: SortOrder
    amountTTC?: SortOrder
  }

  export type LysmaExpenseMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    provider?: SortOrder
    category?: SortOrder
    relatedTool?: SortOrder
    amountHT?: SortOrder
    vatAmount?: SortOrder
    amountTTC?: SortOrder
    frequency?: SortOrder
    startDate?: SortOrder
    renewalDate?: SortOrder
    paymentMethod?: SortOrder
    status?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LysmaExpenseMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    provider?: SortOrder
    category?: SortOrder
    relatedTool?: SortOrder
    amountHT?: SortOrder
    vatAmount?: SortOrder
    amountTTC?: SortOrder
    frequency?: SortOrder
    startDate?: SortOrder
    renewalDate?: SortOrder
    paymentMethod?: SortOrder
    status?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LysmaExpenseSumOrderByAggregateInput = {
    amountHT?: SortOrder
    vatAmount?: SortOrder
    amountTTC?: SortOrder
  }

  export type EnumExpenseCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ExpenseCategory | EnumExpenseCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.ExpenseCategory[] | ListEnumExpenseCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.ExpenseCategory[] | ListEnumExpenseCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumExpenseCategoryWithAggregatesFilter<$PrismaModel> | $Enums.ExpenseCategory
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumExpenseCategoryFilter<$PrismaModel>
    _max?: NestedEnumExpenseCategoryFilter<$PrismaModel>
  }

  export type EnumFinanceToolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FinanceTool | EnumFinanceToolFieldRefInput<$PrismaModel>
    in?: $Enums.FinanceTool[] | ListEnumFinanceToolFieldRefInput<$PrismaModel>
    notIn?: $Enums.FinanceTool[] | ListEnumFinanceToolFieldRefInput<$PrismaModel>
    not?: NestedEnumFinanceToolWithAggregatesFilter<$PrismaModel> | $Enums.FinanceTool
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFinanceToolFilter<$PrismaModel>
    _max?: NestedEnumFinanceToolFilter<$PrismaModel>
  }

  export type EnumFinanceFrequencyWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FinanceFrequency | EnumFinanceFrequencyFieldRefInput<$PrismaModel>
    in?: $Enums.FinanceFrequency[] | ListEnumFinanceFrequencyFieldRefInput<$PrismaModel>
    notIn?: $Enums.FinanceFrequency[] | ListEnumFinanceFrequencyFieldRefInput<$PrismaModel>
    not?: NestedEnumFinanceFrequencyWithAggregatesFilter<$PrismaModel> | $Enums.FinanceFrequency
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFinanceFrequencyFilter<$PrismaModel>
    _max?: NestedEnumFinanceFrequencyFilter<$PrismaModel>
  }

  export type EnumExpenseStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ExpenseStatus | EnumExpenseStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ExpenseStatus[] | ListEnumExpenseStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ExpenseStatus[] | ListEnumExpenseStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumExpenseStatusWithAggregatesFilter<$PrismaModel> | $Enums.ExpenseStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumExpenseStatusFilter<$PrismaModel>
    _max?: NestedEnumExpenseStatusFilter<$PrismaModel>
  }

  export type EnumRevenueStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.RevenueStatus | EnumRevenueStatusFieldRefInput<$PrismaModel>
    in?: $Enums.RevenueStatus[] | ListEnumRevenueStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.RevenueStatus[] | ListEnumRevenueStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumRevenueStatusFilter<$PrismaModel> | $Enums.RevenueStatus
  }

  export type FinancePaymentListRelationFilter = {
    every?: FinancePaymentWhereInput
    some?: FinancePaymentWhereInput
    none?: FinancePaymentWhereInput
  }

  export type FinancePaymentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RevenueSubscriptionCountOrderByAggregateInput = {
    id?: SortOrder
    clientName?: SortOrder
    clientCompany?: SortOrder
    tool?: SortOrder
    planName?: SortOrder
    amountHT?: SortOrder
    vatAmount?: SortOrder
    amountTTC?: SortOrder
    frequency?: SortOrder
    status?: SortOrder
    trialStartAt?: SortOrder
    trialEndAt?: SortOrder
    startDate?: SortOrder
    nextInvoiceAt?: SortOrder
    nextPaymentAt?: SortOrder
    gocardlessCustomerId?: SortOrder
    gocardlessMandateId?: SortOrder
    gocardlessSubscriptionId?: SortOrder
    sageCustomerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RevenueSubscriptionAvgOrderByAggregateInput = {
    amountHT?: SortOrder
    vatAmount?: SortOrder
    amountTTC?: SortOrder
  }

  export type RevenueSubscriptionMaxOrderByAggregateInput = {
    id?: SortOrder
    clientName?: SortOrder
    clientCompany?: SortOrder
    tool?: SortOrder
    planName?: SortOrder
    amountHT?: SortOrder
    vatAmount?: SortOrder
    amountTTC?: SortOrder
    frequency?: SortOrder
    status?: SortOrder
    trialStartAt?: SortOrder
    trialEndAt?: SortOrder
    startDate?: SortOrder
    nextInvoiceAt?: SortOrder
    nextPaymentAt?: SortOrder
    gocardlessCustomerId?: SortOrder
    gocardlessMandateId?: SortOrder
    gocardlessSubscriptionId?: SortOrder
    sageCustomerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RevenueSubscriptionMinOrderByAggregateInput = {
    id?: SortOrder
    clientName?: SortOrder
    clientCompany?: SortOrder
    tool?: SortOrder
    planName?: SortOrder
    amountHT?: SortOrder
    vatAmount?: SortOrder
    amountTTC?: SortOrder
    frequency?: SortOrder
    status?: SortOrder
    trialStartAt?: SortOrder
    trialEndAt?: SortOrder
    startDate?: SortOrder
    nextInvoiceAt?: SortOrder
    nextPaymentAt?: SortOrder
    gocardlessCustomerId?: SortOrder
    gocardlessMandateId?: SortOrder
    gocardlessSubscriptionId?: SortOrder
    sageCustomerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RevenueSubscriptionSumOrderByAggregateInput = {
    amountHT?: SortOrder
    vatAmount?: SortOrder
    amountTTC?: SortOrder
  }

  export type EnumRevenueStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RevenueStatus | EnumRevenueStatusFieldRefInput<$PrismaModel>
    in?: $Enums.RevenueStatus[] | ListEnumRevenueStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.RevenueStatus[] | ListEnumRevenueStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumRevenueStatusWithAggregatesFilter<$PrismaModel> | $Enums.RevenueStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRevenueStatusFilter<$PrismaModel>
    _max?: NestedEnumRevenueStatusFilter<$PrismaModel>
  }

  export type EnumFinanceInvoiceStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.FinanceInvoiceStatus | EnumFinanceInvoiceStatusFieldRefInput<$PrismaModel>
    in?: $Enums.FinanceInvoiceStatus[] | ListEnumFinanceInvoiceStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.FinanceInvoiceStatus[] | ListEnumFinanceInvoiceStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumFinanceInvoiceStatusFilter<$PrismaModel> | $Enums.FinanceInvoiceStatus
  }

  export type EnumElectronicInvoiceStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ElectronicInvoiceStatus | EnumElectronicInvoiceStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ElectronicInvoiceStatus[] | ListEnumElectronicInvoiceStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ElectronicInvoiceStatus[] | ListEnumElectronicInvoiceStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumElectronicInvoiceStatusFilter<$PrismaModel> | $Enums.ElectronicInvoiceStatus
  }

  export type FinanceInvoiceCountOrderByAggregateInput = {
    id?: SortOrder
    invoiceNumber?: SortOrder
    clientName?: SortOrder
    clientCompany?: SortOrder
    tool?: SortOrder
    amountHT?: SortOrder
    vatAmount?: SortOrder
    amountTTC?: SortOrder
    status?: SortOrder
    issueDate?: SortOrder
    dueDate?: SortOrder
    paidAt?: SortOrder
    pdfUrl?: SortOrder
    sageInvoiceId?: SortOrder
    sageInvoiceStatus?: SortOrder
    electronicInvoiceStatus?: SortOrder
    platformProvider?: SortOrder
    platformInvoiceId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FinanceInvoiceAvgOrderByAggregateInput = {
    amountHT?: SortOrder
    vatAmount?: SortOrder
    amountTTC?: SortOrder
  }

  export type FinanceInvoiceMaxOrderByAggregateInput = {
    id?: SortOrder
    invoiceNumber?: SortOrder
    clientName?: SortOrder
    clientCompany?: SortOrder
    tool?: SortOrder
    amountHT?: SortOrder
    vatAmount?: SortOrder
    amountTTC?: SortOrder
    status?: SortOrder
    issueDate?: SortOrder
    dueDate?: SortOrder
    paidAt?: SortOrder
    pdfUrl?: SortOrder
    sageInvoiceId?: SortOrder
    sageInvoiceStatus?: SortOrder
    electronicInvoiceStatus?: SortOrder
    platformProvider?: SortOrder
    platformInvoiceId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FinanceInvoiceMinOrderByAggregateInput = {
    id?: SortOrder
    invoiceNumber?: SortOrder
    clientName?: SortOrder
    clientCompany?: SortOrder
    tool?: SortOrder
    amountHT?: SortOrder
    vatAmount?: SortOrder
    amountTTC?: SortOrder
    status?: SortOrder
    issueDate?: SortOrder
    dueDate?: SortOrder
    paidAt?: SortOrder
    pdfUrl?: SortOrder
    sageInvoiceId?: SortOrder
    sageInvoiceStatus?: SortOrder
    electronicInvoiceStatus?: SortOrder
    platformProvider?: SortOrder
    platformInvoiceId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FinanceInvoiceSumOrderByAggregateInput = {
    amountHT?: SortOrder
    vatAmount?: SortOrder
    amountTTC?: SortOrder
  }

  export type EnumFinanceInvoiceStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FinanceInvoiceStatus | EnumFinanceInvoiceStatusFieldRefInput<$PrismaModel>
    in?: $Enums.FinanceInvoiceStatus[] | ListEnumFinanceInvoiceStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.FinanceInvoiceStatus[] | ListEnumFinanceInvoiceStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumFinanceInvoiceStatusWithAggregatesFilter<$PrismaModel> | $Enums.FinanceInvoiceStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFinanceInvoiceStatusFilter<$PrismaModel>
    _max?: NestedEnumFinanceInvoiceStatusFilter<$PrismaModel>
  }

  export type EnumElectronicInvoiceStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ElectronicInvoiceStatus | EnumElectronicInvoiceStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ElectronicInvoiceStatus[] | ListEnumElectronicInvoiceStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ElectronicInvoiceStatus[] | ListEnumElectronicInvoiceStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumElectronicInvoiceStatusWithAggregatesFilter<$PrismaModel> | $Enums.ElectronicInvoiceStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumElectronicInvoiceStatusFilter<$PrismaModel>
    _max?: NestedEnumElectronicInvoiceStatusFilter<$PrismaModel>
  }

  export type EnumFinancePaymentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.FinancePaymentStatus | EnumFinancePaymentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.FinancePaymentStatus[] | ListEnumFinancePaymentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.FinancePaymentStatus[] | ListEnumFinancePaymentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumFinancePaymentStatusFilter<$PrismaModel> | $Enums.FinancePaymentStatus
  }

  export type FinanceInvoiceNullableScalarRelationFilter = {
    is?: FinanceInvoiceWhereInput | null
    isNot?: FinanceInvoiceWhereInput | null
  }

  export type RevenueSubscriptionNullableScalarRelationFilter = {
    is?: RevenueSubscriptionWhereInput | null
    isNot?: RevenueSubscriptionWhereInput | null
  }

  export type FinancePaymentCountOrderByAggregateInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    subscriptionId?: SortOrder
    amount?: SortOrder
    status?: SortOrder
    method?: SortOrder
    gocardlessPaymentId?: SortOrder
    paidAt?: SortOrder
    failedAt?: SortOrder
    failureReason?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FinancePaymentAvgOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type FinancePaymentMaxOrderByAggregateInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    subscriptionId?: SortOrder
    amount?: SortOrder
    status?: SortOrder
    method?: SortOrder
    gocardlessPaymentId?: SortOrder
    paidAt?: SortOrder
    failedAt?: SortOrder
    failureReason?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FinancePaymentMinOrderByAggregateInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    subscriptionId?: SortOrder
    amount?: SortOrder
    status?: SortOrder
    method?: SortOrder
    gocardlessPaymentId?: SortOrder
    paidAt?: SortOrder
    failedAt?: SortOrder
    failureReason?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FinancePaymentSumOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type EnumFinancePaymentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FinancePaymentStatus | EnumFinancePaymentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.FinancePaymentStatus[] | ListEnumFinancePaymentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.FinancePaymentStatus[] | ListEnumFinancePaymentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumFinancePaymentStatusWithAggregatesFilter<$PrismaModel> | $Enums.FinancePaymentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFinancePaymentStatusFilter<$PrismaModel>
    _max?: NestedEnumFinancePaymentStatusFilter<$PrismaModel>
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type AccesCreateNestedManyWithoutClientInput = {
    create?: XOR<AccesCreateWithoutClientInput, AccesUncheckedCreateWithoutClientInput> | AccesCreateWithoutClientInput[] | AccesUncheckedCreateWithoutClientInput[]
    connectOrCreate?: AccesCreateOrConnectWithoutClientInput | AccesCreateOrConnectWithoutClientInput[]
    createMany?: AccesCreateManyClientInputEnvelope
    connect?: AccesWhereUniqueInput | AccesWhereUniqueInput[]
  }

  export type MessageCreateNestedManyWithoutClientInput = {
    create?: XOR<MessageCreateWithoutClientInput, MessageUncheckedCreateWithoutClientInput> | MessageCreateWithoutClientInput[] | MessageUncheckedCreateWithoutClientInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutClientInput | MessageCreateOrConnectWithoutClientInput[]
    createMany?: MessageCreateManyClientInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type AccesUncheckedCreateNestedManyWithoutClientInput = {
    create?: XOR<AccesCreateWithoutClientInput, AccesUncheckedCreateWithoutClientInput> | AccesCreateWithoutClientInput[] | AccesUncheckedCreateWithoutClientInput[]
    connectOrCreate?: AccesCreateOrConnectWithoutClientInput | AccesCreateOrConnectWithoutClientInput[]
    createMany?: AccesCreateManyClientInputEnvelope
    connect?: AccesWhereUniqueInput | AccesWhereUniqueInput[]
  }

  export type MessageUncheckedCreateNestedManyWithoutClientInput = {
    create?: XOR<MessageCreateWithoutClientInput, MessageUncheckedCreateWithoutClientInput> | MessageCreateWithoutClientInput[] | MessageUncheckedCreateWithoutClientInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutClientInput | MessageCreateOrConnectWithoutClientInput[]
    createMany?: MessageCreateManyClientInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumClientStatutFieldUpdateOperationsInput = {
    set?: $Enums.ClientStatut
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type AccesUpdateManyWithoutClientNestedInput = {
    create?: XOR<AccesCreateWithoutClientInput, AccesUncheckedCreateWithoutClientInput> | AccesCreateWithoutClientInput[] | AccesUncheckedCreateWithoutClientInput[]
    connectOrCreate?: AccesCreateOrConnectWithoutClientInput | AccesCreateOrConnectWithoutClientInput[]
    upsert?: AccesUpsertWithWhereUniqueWithoutClientInput | AccesUpsertWithWhereUniqueWithoutClientInput[]
    createMany?: AccesCreateManyClientInputEnvelope
    set?: AccesWhereUniqueInput | AccesWhereUniqueInput[]
    disconnect?: AccesWhereUniqueInput | AccesWhereUniqueInput[]
    delete?: AccesWhereUniqueInput | AccesWhereUniqueInput[]
    connect?: AccesWhereUniqueInput | AccesWhereUniqueInput[]
    update?: AccesUpdateWithWhereUniqueWithoutClientInput | AccesUpdateWithWhereUniqueWithoutClientInput[]
    updateMany?: AccesUpdateManyWithWhereWithoutClientInput | AccesUpdateManyWithWhereWithoutClientInput[]
    deleteMany?: AccesScalarWhereInput | AccesScalarWhereInput[]
  }

  export type MessageUpdateManyWithoutClientNestedInput = {
    create?: XOR<MessageCreateWithoutClientInput, MessageUncheckedCreateWithoutClientInput> | MessageCreateWithoutClientInput[] | MessageUncheckedCreateWithoutClientInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutClientInput | MessageCreateOrConnectWithoutClientInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutClientInput | MessageUpsertWithWhereUniqueWithoutClientInput[]
    createMany?: MessageCreateManyClientInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutClientInput | MessageUpdateWithWhereUniqueWithoutClientInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutClientInput | MessageUpdateManyWithWhereWithoutClientInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type AccesUncheckedUpdateManyWithoutClientNestedInput = {
    create?: XOR<AccesCreateWithoutClientInput, AccesUncheckedCreateWithoutClientInput> | AccesCreateWithoutClientInput[] | AccesUncheckedCreateWithoutClientInput[]
    connectOrCreate?: AccesCreateOrConnectWithoutClientInput | AccesCreateOrConnectWithoutClientInput[]
    upsert?: AccesUpsertWithWhereUniqueWithoutClientInput | AccesUpsertWithWhereUniqueWithoutClientInput[]
    createMany?: AccesCreateManyClientInputEnvelope
    set?: AccesWhereUniqueInput | AccesWhereUniqueInput[]
    disconnect?: AccesWhereUniqueInput | AccesWhereUniqueInput[]
    delete?: AccesWhereUniqueInput | AccesWhereUniqueInput[]
    connect?: AccesWhereUniqueInput | AccesWhereUniqueInput[]
    update?: AccesUpdateWithWhereUniqueWithoutClientInput | AccesUpdateWithWhereUniqueWithoutClientInput[]
    updateMany?: AccesUpdateManyWithWhereWithoutClientInput | AccesUpdateManyWithWhereWithoutClientInput[]
    deleteMany?: AccesScalarWhereInput | AccesScalarWhereInput[]
  }

  export type MessageUncheckedUpdateManyWithoutClientNestedInput = {
    create?: XOR<MessageCreateWithoutClientInput, MessageUncheckedCreateWithoutClientInput> | MessageCreateWithoutClientInput[] | MessageUncheckedCreateWithoutClientInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutClientInput | MessageCreateOrConnectWithoutClientInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutClientInput | MessageUpsertWithWhereUniqueWithoutClientInput[]
    createMany?: MessageCreateManyClientInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutClientInput | MessageUpdateWithWhereUniqueWithoutClientInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutClientInput | MessageUpdateManyWithWhereWithoutClientInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type ClientCreateNestedOneWithoutAccesInput = {
    create?: XOR<ClientCreateWithoutAccesInput, ClientUncheckedCreateWithoutAccesInput>
    connectOrCreate?: ClientCreateOrConnectWithoutAccesInput
    connect?: ClientWhereUniqueInput
  }

  export type ClientUpdateOneRequiredWithoutAccesNestedInput = {
    create?: XOR<ClientCreateWithoutAccesInput, ClientUncheckedCreateWithoutAccesInput>
    connectOrCreate?: ClientCreateOrConnectWithoutAccesInput
    upsert?: ClientUpsertWithoutAccesInput
    connect?: ClientWhereUniqueInput
    update?: XOR<XOR<ClientUpdateToOneWithWhereWithoutAccesInput, ClientUpdateWithoutAccesInput>, ClientUncheckedUpdateWithoutAccesInput>
  }

  export type ClientCreateNestedOneWithoutMessagesInput = {
    create?: XOR<ClientCreateWithoutMessagesInput, ClientUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: ClientCreateOrConnectWithoutMessagesInput
    connect?: ClientWhereUniqueInput
  }

  export type EnumMessageStatutFieldUpdateOperationsInput = {
    set?: $Enums.MessageStatut
  }

  export type ClientUpdateOneWithoutMessagesNestedInput = {
    create?: XOR<ClientCreateWithoutMessagesInput, ClientUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: ClientCreateOrConnectWithoutMessagesInput
    upsert?: ClientUpsertWithoutMessagesInput
    disconnect?: ClientWhereInput | boolean
    delete?: ClientWhereInput | boolean
    connect?: ClientWhereUniqueInput
    update?: XOR<XOR<ClientUpdateToOneWithWhereWithoutMessagesInput, ClientUpdateWithoutMessagesInput>, ClientUncheckedUpdateWithoutMessagesInput>
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type EnumFinanceVatStatusFieldUpdateOperationsInput = {
    set?: $Enums.FinanceVatStatus
  }

  export type EnumFinanceDeclarationFrequencyFieldUpdateOperationsInput = {
    set?: $Enums.FinanceDeclarationFrequency
  }

  export type EnumExpenseCategoryFieldUpdateOperationsInput = {
    set?: $Enums.ExpenseCategory
  }

  export type EnumFinanceToolFieldUpdateOperationsInput = {
    set?: $Enums.FinanceTool
  }

  export type EnumFinanceFrequencyFieldUpdateOperationsInput = {
    set?: $Enums.FinanceFrequency
  }

  export type EnumExpenseStatusFieldUpdateOperationsInput = {
    set?: $Enums.ExpenseStatus
  }

  export type FinancePaymentCreateNestedManyWithoutSubscriptionInput = {
    create?: XOR<FinancePaymentCreateWithoutSubscriptionInput, FinancePaymentUncheckedCreateWithoutSubscriptionInput> | FinancePaymentCreateWithoutSubscriptionInput[] | FinancePaymentUncheckedCreateWithoutSubscriptionInput[]
    connectOrCreate?: FinancePaymentCreateOrConnectWithoutSubscriptionInput | FinancePaymentCreateOrConnectWithoutSubscriptionInput[]
    createMany?: FinancePaymentCreateManySubscriptionInputEnvelope
    connect?: FinancePaymentWhereUniqueInput | FinancePaymentWhereUniqueInput[]
  }

  export type FinancePaymentUncheckedCreateNestedManyWithoutSubscriptionInput = {
    create?: XOR<FinancePaymentCreateWithoutSubscriptionInput, FinancePaymentUncheckedCreateWithoutSubscriptionInput> | FinancePaymentCreateWithoutSubscriptionInput[] | FinancePaymentUncheckedCreateWithoutSubscriptionInput[]
    connectOrCreate?: FinancePaymentCreateOrConnectWithoutSubscriptionInput | FinancePaymentCreateOrConnectWithoutSubscriptionInput[]
    createMany?: FinancePaymentCreateManySubscriptionInputEnvelope
    connect?: FinancePaymentWhereUniqueInput | FinancePaymentWhereUniqueInput[]
  }

  export type EnumRevenueStatusFieldUpdateOperationsInput = {
    set?: $Enums.RevenueStatus
  }

  export type FinancePaymentUpdateManyWithoutSubscriptionNestedInput = {
    create?: XOR<FinancePaymentCreateWithoutSubscriptionInput, FinancePaymentUncheckedCreateWithoutSubscriptionInput> | FinancePaymentCreateWithoutSubscriptionInput[] | FinancePaymentUncheckedCreateWithoutSubscriptionInput[]
    connectOrCreate?: FinancePaymentCreateOrConnectWithoutSubscriptionInput | FinancePaymentCreateOrConnectWithoutSubscriptionInput[]
    upsert?: FinancePaymentUpsertWithWhereUniqueWithoutSubscriptionInput | FinancePaymentUpsertWithWhereUniqueWithoutSubscriptionInput[]
    createMany?: FinancePaymentCreateManySubscriptionInputEnvelope
    set?: FinancePaymentWhereUniqueInput | FinancePaymentWhereUniqueInput[]
    disconnect?: FinancePaymentWhereUniqueInput | FinancePaymentWhereUniqueInput[]
    delete?: FinancePaymentWhereUniqueInput | FinancePaymentWhereUniqueInput[]
    connect?: FinancePaymentWhereUniqueInput | FinancePaymentWhereUniqueInput[]
    update?: FinancePaymentUpdateWithWhereUniqueWithoutSubscriptionInput | FinancePaymentUpdateWithWhereUniqueWithoutSubscriptionInput[]
    updateMany?: FinancePaymentUpdateManyWithWhereWithoutSubscriptionInput | FinancePaymentUpdateManyWithWhereWithoutSubscriptionInput[]
    deleteMany?: FinancePaymentScalarWhereInput | FinancePaymentScalarWhereInput[]
  }

  export type FinancePaymentUncheckedUpdateManyWithoutSubscriptionNestedInput = {
    create?: XOR<FinancePaymentCreateWithoutSubscriptionInput, FinancePaymentUncheckedCreateWithoutSubscriptionInput> | FinancePaymentCreateWithoutSubscriptionInput[] | FinancePaymentUncheckedCreateWithoutSubscriptionInput[]
    connectOrCreate?: FinancePaymentCreateOrConnectWithoutSubscriptionInput | FinancePaymentCreateOrConnectWithoutSubscriptionInput[]
    upsert?: FinancePaymentUpsertWithWhereUniqueWithoutSubscriptionInput | FinancePaymentUpsertWithWhereUniqueWithoutSubscriptionInput[]
    createMany?: FinancePaymentCreateManySubscriptionInputEnvelope
    set?: FinancePaymentWhereUniqueInput | FinancePaymentWhereUniqueInput[]
    disconnect?: FinancePaymentWhereUniqueInput | FinancePaymentWhereUniqueInput[]
    delete?: FinancePaymentWhereUniqueInput | FinancePaymentWhereUniqueInput[]
    connect?: FinancePaymentWhereUniqueInput | FinancePaymentWhereUniqueInput[]
    update?: FinancePaymentUpdateWithWhereUniqueWithoutSubscriptionInput | FinancePaymentUpdateWithWhereUniqueWithoutSubscriptionInput[]
    updateMany?: FinancePaymentUpdateManyWithWhereWithoutSubscriptionInput | FinancePaymentUpdateManyWithWhereWithoutSubscriptionInput[]
    deleteMany?: FinancePaymentScalarWhereInput | FinancePaymentScalarWhereInput[]
  }

  export type FinancePaymentCreateNestedManyWithoutInvoiceInput = {
    create?: XOR<FinancePaymentCreateWithoutInvoiceInput, FinancePaymentUncheckedCreateWithoutInvoiceInput> | FinancePaymentCreateWithoutInvoiceInput[] | FinancePaymentUncheckedCreateWithoutInvoiceInput[]
    connectOrCreate?: FinancePaymentCreateOrConnectWithoutInvoiceInput | FinancePaymentCreateOrConnectWithoutInvoiceInput[]
    createMany?: FinancePaymentCreateManyInvoiceInputEnvelope
    connect?: FinancePaymentWhereUniqueInput | FinancePaymentWhereUniqueInput[]
  }

  export type FinancePaymentUncheckedCreateNestedManyWithoutInvoiceInput = {
    create?: XOR<FinancePaymentCreateWithoutInvoiceInput, FinancePaymentUncheckedCreateWithoutInvoiceInput> | FinancePaymentCreateWithoutInvoiceInput[] | FinancePaymentUncheckedCreateWithoutInvoiceInput[]
    connectOrCreate?: FinancePaymentCreateOrConnectWithoutInvoiceInput | FinancePaymentCreateOrConnectWithoutInvoiceInput[]
    createMany?: FinancePaymentCreateManyInvoiceInputEnvelope
    connect?: FinancePaymentWhereUniqueInput | FinancePaymentWhereUniqueInput[]
  }

  export type EnumFinanceInvoiceStatusFieldUpdateOperationsInput = {
    set?: $Enums.FinanceInvoiceStatus
  }

  export type EnumElectronicInvoiceStatusFieldUpdateOperationsInput = {
    set?: $Enums.ElectronicInvoiceStatus
  }

  export type FinancePaymentUpdateManyWithoutInvoiceNestedInput = {
    create?: XOR<FinancePaymentCreateWithoutInvoiceInput, FinancePaymentUncheckedCreateWithoutInvoiceInput> | FinancePaymentCreateWithoutInvoiceInput[] | FinancePaymentUncheckedCreateWithoutInvoiceInput[]
    connectOrCreate?: FinancePaymentCreateOrConnectWithoutInvoiceInput | FinancePaymentCreateOrConnectWithoutInvoiceInput[]
    upsert?: FinancePaymentUpsertWithWhereUniqueWithoutInvoiceInput | FinancePaymentUpsertWithWhereUniqueWithoutInvoiceInput[]
    createMany?: FinancePaymentCreateManyInvoiceInputEnvelope
    set?: FinancePaymentWhereUniqueInput | FinancePaymentWhereUniqueInput[]
    disconnect?: FinancePaymentWhereUniqueInput | FinancePaymentWhereUniqueInput[]
    delete?: FinancePaymentWhereUniqueInput | FinancePaymentWhereUniqueInput[]
    connect?: FinancePaymentWhereUniqueInput | FinancePaymentWhereUniqueInput[]
    update?: FinancePaymentUpdateWithWhereUniqueWithoutInvoiceInput | FinancePaymentUpdateWithWhereUniqueWithoutInvoiceInput[]
    updateMany?: FinancePaymentUpdateManyWithWhereWithoutInvoiceInput | FinancePaymentUpdateManyWithWhereWithoutInvoiceInput[]
    deleteMany?: FinancePaymentScalarWhereInput | FinancePaymentScalarWhereInput[]
  }

  export type FinancePaymentUncheckedUpdateManyWithoutInvoiceNestedInput = {
    create?: XOR<FinancePaymentCreateWithoutInvoiceInput, FinancePaymentUncheckedCreateWithoutInvoiceInput> | FinancePaymentCreateWithoutInvoiceInput[] | FinancePaymentUncheckedCreateWithoutInvoiceInput[]
    connectOrCreate?: FinancePaymentCreateOrConnectWithoutInvoiceInput | FinancePaymentCreateOrConnectWithoutInvoiceInput[]
    upsert?: FinancePaymentUpsertWithWhereUniqueWithoutInvoiceInput | FinancePaymentUpsertWithWhereUniqueWithoutInvoiceInput[]
    createMany?: FinancePaymentCreateManyInvoiceInputEnvelope
    set?: FinancePaymentWhereUniqueInput | FinancePaymentWhereUniqueInput[]
    disconnect?: FinancePaymentWhereUniqueInput | FinancePaymentWhereUniqueInput[]
    delete?: FinancePaymentWhereUniqueInput | FinancePaymentWhereUniqueInput[]
    connect?: FinancePaymentWhereUniqueInput | FinancePaymentWhereUniqueInput[]
    update?: FinancePaymentUpdateWithWhereUniqueWithoutInvoiceInput | FinancePaymentUpdateWithWhereUniqueWithoutInvoiceInput[]
    updateMany?: FinancePaymentUpdateManyWithWhereWithoutInvoiceInput | FinancePaymentUpdateManyWithWhereWithoutInvoiceInput[]
    deleteMany?: FinancePaymentScalarWhereInput | FinancePaymentScalarWhereInput[]
  }

  export type FinanceInvoiceCreateNestedOneWithoutPaymentsInput = {
    create?: XOR<FinanceInvoiceCreateWithoutPaymentsInput, FinanceInvoiceUncheckedCreateWithoutPaymentsInput>
    connectOrCreate?: FinanceInvoiceCreateOrConnectWithoutPaymentsInput
    connect?: FinanceInvoiceWhereUniqueInput
  }

  export type RevenueSubscriptionCreateNestedOneWithoutPaymentsInput = {
    create?: XOR<RevenueSubscriptionCreateWithoutPaymentsInput, RevenueSubscriptionUncheckedCreateWithoutPaymentsInput>
    connectOrCreate?: RevenueSubscriptionCreateOrConnectWithoutPaymentsInput
    connect?: RevenueSubscriptionWhereUniqueInput
  }

  export type EnumFinancePaymentStatusFieldUpdateOperationsInput = {
    set?: $Enums.FinancePaymentStatus
  }

  export type FinanceInvoiceUpdateOneWithoutPaymentsNestedInput = {
    create?: XOR<FinanceInvoiceCreateWithoutPaymentsInput, FinanceInvoiceUncheckedCreateWithoutPaymentsInput>
    connectOrCreate?: FinanceInvoiceCreateOrConnectWithoutPaymentsInput
    upsert?: FinanceInvoiceUpsertWithoutPaymentsInput
    disconnect?: FinanceInvoiceWhereInput | boolean
    delete?: FinanceInvoiceWhereInput | boolean
    connect?: FinanceInvoiceWhereUniqueInput
    update?: XOR<XOR<FinanceInvoiceUpdateToOneWithWhereWithoutPaymentsInput, FinanceInvoiceUpdateWithoutPaymentsInput>, FinanceInvoiceUncheckedUpdateWithoutPaymentsInput>
  }

  export type RevenueSubscriptionUpdateOneWithoutPaymentsNestedInput = {
    create?: XOR<RevenueSubscriptionCreateWithoutPaymentsInput, RevenueSubscriptionUncheckedCreateWithoutPaymentsInput>
    connectOrCreate?: RevenueSubscriptionCreateOrConnectWithoutPaymentsInput
    upsert?: RevenueSubscriptionUpsertWithoutPaymentsInput
    disconnect?: RevenueSubscriptionWhereInput | boolean
    delete?: RevenueSubscriptionWhereInput | boolean
    connect?: RevenueSubscriptionWhereUniqueInput
    update?: XOR<XOR<RevenueSubscriptionUpdateToOneWithWhereWithoutPaymentsInput, RevenueSubscriptionUpdateWithoutPaymentsInput>, RevenueSubscriptionUncheckedUpdateWithoutPaymentsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumClientStatutFilter<$PrismaModel = never> = {
    equals?: $Enums.ClientStatut | EnumClientStatutFieldRefInput<$PrismaModel>
    in?: $Enums.ClientStatut[] | ListEnumClientStatutFieldRefInput<$PrismaModel>
    notIn?: $Enums.ClientStatut[] | ListEnumClientStatutFieldRefInput<$PrismaModel>
    not?: NestedEnumClientStatutFilter<$PrismaModel> | $Enums.ClientStatut
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumClientStatutWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ClientStatut | EnumClientStatutFieldRefInput<$PrismaModel>
    in?: $Enums.ClientStatut[] | ListEnumClientStatutFieldRefInput<$PrismaModel>
    notIn?: $Enums.ClientStatut[] | ListEnumClientStatutFieldRefInput<$PrismaModel>
    not?: NestedEnumClientStatutWithAggregatesFilter<$PrismaModel> | $Enums.ClientStatut
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumClientStatutFilter<$PrismaModel>
    _max?: NestedEnumClientStatutFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumMessageStatutFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageStatut | EnumMessageStatutFieldRefInput<$PrismaModel>
    in?: $Enums.MessageStatut[] | ListEnumMessageStatutFieldRefInput<$PrismaModel>
    notIn?: $Enums.MessageStatut[] | ListEnumMessageStatutFieldRefInput<$PrismaModel>
    not?: NestedEnumMessageStatutFilter<$PrismaModel> | $Enums.MessageStatut
  }

  export type NestedEnumMessageStatutWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MessageStatut | EnumMessageStatutFieldRefInput<$PrismaModel>
    in?: $Enums.MessageStatut[] | ListEnumMessageStatutFieldRefInput<$PrismaModel>
    notIn?: $Enums.MessageStatut[] | ListEnumMessageStatutFieldRefInput<$PrismaModel>
    not?: NestedEnumMessageStatutWithAggregatesFilter<$PrismaModel> | $Enums.MessageStatut
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMessageStatutFilter<$PrismaModel>
    _max?: NestedEnumMessageStatutFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedEnumFinanceVatStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.FinanceVatStatus | EnumFinanceVatStatusFieldRefInput<$PrismaModel>
    in?: $Enums.FinanceVatStatus[] | ListEnumFinanceVatStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.FinanceVatStatus[] | ListEnumFinanceVatStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumFinanceVatStatusFilter<$PrismaModel> | $Enums.FinanceVatStatus
  }

  export type NestedEnumFinanceDeclarationFrequencyFilter<$PrismaModel = never> = {
    equals?: $Enums.FinanceDeclarationFrequency | EnumFinanceDeclarationFrequencyFieldRefInput<$PrismaModel>
    in?: $Enums.FinanceDeclarationFrequency[] | ListEnumFinanceDeclarationFrequencyFieldRefInput<$PrismaModel>
    notIn?: $Enums.FinanceDeclarationFrequency[] | ListEnumFinanceDeclarationFrequencyFieldRefInput<$PrismaModel>
    not?: NestedEnumFinanceDeclarationFrequencyFilter<$PrismaModel> | $Enums.FinanceDeclarationFrequency
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type NestedEnumFinanceVatStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FinanceVatStatus | EnumFinanceVatStatusFieldRefInput<$PrismaModel>
    in?: $Enums.FinanceVatStatus[] | ListEnumFinanceVatStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.FinanceVatStatus[] | ListEnumFinanceVatStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumFinanceVatStatusWithAggregatesFilter<$PrismaModel> | $Enums.FinanceVatStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFinanceVatStatusFilter<$PrismaModel>
    _max?: NestedEnumFinanceVatStatusFilter<$PrismaModel>
  }

  export type NestedEnumFinanceDeclarationFrequencyWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FinanceDeclarationFrequency | EnumFinanceDeclarationFrequencyFieldRefInput<$PrismaModel>
    in?: $Enums.FinanceDeclarationFrequency[] | ListEnumFinanceDeclarationFrequencyFieldRefInput<$PrismaModel>
    notIn?: $Enums.FinanceDeclarationFrequency[] | ListEnumFinanceDeclarationFrequencyFieldRefInput<$PrismaModel>
    not?: NestedEnumFinanceDeclarationFrequencyWithAggregatesFilter<$PrismaModel> | $Enums.FinanceDeclarationFrequency
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFinanceDeclarationFrequencyFilter<$PrismaModel>
    _max?: NestedEnumFinanceDeclarationFrequencyFilter<$PrismaModel>
  }

  export type NestedEnumExpenseCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.ExpenseCategory | EnumExpenseCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.ExpenseCategory[] | ListEnumExpenseCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.ExpenseCategory[] | ListEnumExpenseCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumExpenseCategoryFilter<$PrismaModel> | $Enums.ExpenseCategory
  }

  export type NestedEnumFinanceToolFilter<$PrismaModel = never> = {
    equals?: $Enums.FinanceTool | EnumFinanceToolFieldRefInput<$PrismaModel>
    in?: $Enums.FinanceTool[] | ListEnumFinanceToolFieldRefInput<$PrismaModel>
    notIn?: $Enums.FinanceTool[] | ListEnumFinanceToolFieldRefInput<$PrismaModel>
    not?: NestedEnumFinanceToolFilter<$PrismaModel> | $Enums.FinanceTool
  }

  export type NestedEnumFinanceFrequencyFilter<$PrismaModel = never> = {
    equals?: $Enums.FinanceFrequency | EnumFinanceFrequencyFieldRefInput<$PrismaModel>
    in?: $Enums.FinanceFrequency[] | ListEnumFinanceFrequencyFieldRefInput<$PrismaModel>
    notIn?: $Enums.FinanceFrequency[] | ListEnumFinanceFrequencyFieldRefInput<$PrismaModel>
    not?: NestedEnumFinanceFrequencyFilter<$PrismaModel> | $Enums.FinanceFrequency
  }

  export type NestedEnumExpenseStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ExpenseStatus | EnumExpenseStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ExpenseStatus[] | ListEnumExpenseStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ExpenseStatus[] | ListEnumExpenseStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumExpenseStatusFilter<$PrismaModel> | $Enums.ExpenseStatus
  }

  export type NestedEnumExpenseCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ExpenseCategory | EnumExpenseCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.ExpenseCategory[] | ListEnumExpenseCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.ExpenseCategory[] | ListEnumExpenseCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumExpenseCategoryWithAggregatesFilter<$PrismaModel> | $Enums.ExpenseCategory
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumExpenseCategoryFilter<$PrismaModel>
    _max?: NestedEnumExpenseCategoryFilter<$PrismaModel>
  }

  export type NestedEnumFinanceToolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FinanceTool | EnumFinanceToolFieldRefInput<$PrismaModel>
    in?: $Enums.FinanceTool[] | ListEnumFinanceToolFieldRefInput<$PrismaModel>
    notIn?: $Enums.FinanceTool[] | ListEnumFinanceToolFieldRefInput<$PrismaModel>
    not?: NestedEnumFinanceToolWithAggregatesFilter<$PrismaModel> | $Enums.FinanceTool
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFinanceToolFilter<$PrismaModel>
    _max?: NestedEnumFinanceToolFilter<$PrismaModel>
  }

  export type NestedEnumFinanceFrequencyWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FinanceFrequency | EnumFinanceFrequencyFieldRefInput<$PrismaModel>
    in?: $Enums.FinanceFrequency[] | ListEnumFinanceFrequencyFieldRefInput<$PrismaModel>
    notIn?: $Enums.FinanceFrequency[] | ListEnumFinanceFrequencyFieldRefInput<$PrismaModel>
    not?: NestedEnumFinanceFrequencyWithAggregatesFilter<$PrismaModel> | $Enums.FinanceFrequency
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFinanceFrequencyFilter<$PrismaModel>
    _max?: NestedEnumFinanceFrequencyFilter<$PrismaModel>
  }

  export type NestedEnumExpenseStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ExpenseStatus | EnumExpenseStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ExpenseStatus[] | ListEnumExpenseStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ExpenseStatus[] | ListEnumExpenseStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumExpenseStatusWithAggregatesFilter<$PrismaModel> | $Enums.ExpenseStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumExpenseStatusFilter<$PrismaModel>
    _max?: NestedEnumExpenseStatusFilter<$PrismaModel>
  }

  export type NestedEnumRevenueStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.RevenueStatus | EnumRevenueStatusFieldRefInput<$PrismaModel>
    in?: $Enums.RevenueStatus[] | ListEnumRevenueStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.RevenueStatus[] | ListEnumRevenueStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumRevenueStatusFilter<$PrismaModel> | $Enums.RevenueStatus
  }

  export type NestedEnumRevenueStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RevenueStatus | EnumRevenueStatusFieldRefInput<$PrismaModel>
    in?: $Enums.RevenueStatus[] | ListEnumRevenueStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.RevenueStatus[] | ListEnumRevenueStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumRevenueStatusWithAggregatesFilter<$PrismaModel> | $Enums.RevenueStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRevenueStatusFilter<$PrismaModel>
    _max?: NestedEnumRevenueStatusFilter<$PrismaModel>
  }

  export type NestedEnumFinanceInvoiceStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.FinanceInvoiceStatus | EnumFinanceInvoiceStatusFieldRefInput<$PrismaModel>
    in?: $Enums.FinanceInvoiceStatus[] | ListEnumFinanceInvoiceStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.FinanceInvoiceStatus[] | ListEnumFinanceInvoiceStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumFinanceInvoiceStatusFilter<$PrismaModel> | $Enums.FinanceInvoiceStatus
  }

  export type NestedEnumElectronicInvoiceStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ElectronicInvoiceStatus | EnumElectronicInvoiceStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ElectronicInvoiceStatus[] | ListEnumElectronicInvoiceStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ElectronicInvoiceStatus[] | ListEnumElectronicInvoiceStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumElectronicInvoiceStatusFilter<$PrismaModel> | $Enums.ElectronicInvoiceStatus
  }

  export type NestedEnumFinanceInvoiceStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FinanceInvoiceStatus | EnumFinanceInvoiceStatusFieldRefInput<$PrismaModel>
    in?: $Enums.FinanceInvoiceStatus[] | ListEnumFinanceInvoiceStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.FinanceInvoiceStatus[] | ListEnumFinanceInvoiceStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumFinanceInvoiceStatusWithAggregatesFilter<$PrismaModel> | $Enums.FinanceInvoiceStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFinanceInvoiceStatusFilter<$PrismaModel>
    _max?: NestedEnumFinanceInvoiceStatusFilter<$PrismaModel>
  }

  export type NestedEnumElectronicInvoiceStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ElectronicInvoiceStatus | EnumElectronicInvoiceStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ElectronicInvoiceStatus[] | ListEnumElectronicInvoiceStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ElectronicInvoiceStatus[] | ListEnumElectronicInvoiceStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumElectronicInvoiceStatusWithAggregatesFilter<$PrismaModel> | $Enums.ElectronicInvoiceStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumElectronicInvoiceStatusFilter<$PrismaModel>
    _max?: NestedEnumElectronicInvoiceStatusFilter<$PrismaModel>
  }

  export type NestedEnumFinancePaymentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.FinancePaymentStatus | EnumFinancePaymentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.FinancePaymentStatus[] | ListEnumFinancePaymentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.FinancePaymentStatus[] | ListEnumFinancePaymentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumFinancePaymentStatusFilter<$PrismaModel> | $Enums.FinancePaymentStatus
  }

  export type NestedEnumFinancePaymentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FinancePaymentStatus | EnumFinancePaymentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.FinancePaymentStatus[] | ListEnumFinancePaymentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.FinancePaymentStatus[] | ListEnumFinancePaymentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumFinancePaymentStatusWithAggregatesFilter<$PrismaModel> | $Enums.FinancePaymentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFinancePaymentStatusFilter<$PrismaModel>
    _max?: NestedEnumFinancePaymentStatusFilter<$PrismaModel>
  }

  export type AccesCreateWithoutClientInput = {
    id?: string
    email: string
    motDePasseTemp?: string | null
    actif?: boolean
    premiereConnexion?: boolean
    createdAt?: Date | string
  }

  export type AccesUncheckedCreateWithoutClientInput = {
    id?: string
    email: string
    motDePasseTemp?: string | null
    actif?: boolean
    premiereConnexion?: boolean
    createdAt?: Date | string
  }

  export type AccesCreateOrConnectWithoutClientInput = {
    where: AccesWhereUniqueInput
    create: XOR<AccesCreateWithoutClientInput, AccesUncheckedCreateWithoutClientInput>
  }

  export type AccesCreateManyClientInputEnvelope = {
    data: AccesCreateManyClientInput | AccesCreateManyClientInput[]
    skipDuplicates?: boolean
  }

  export type MessageCreateWithoutClientInput = {
    id?: string
    nom: string
    email: string
    societe?: string | null
    telephone?: string | null
    outil?: string
    message: string
    statut?: $Enums.MessageStatut
    reponse?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MessageUncheckedCreateWithoutClientInput = {
    id?: string
    nom: string
    email: string
    societe?: string | null
    telephone?: string | null
    outil?: string
    message: string
    statut?: $Enums.MessageStatut
    reponse?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MessageCreateOrConnectWithoutClientInput = {
    where: MessageWhereUniqueInput
    create: XOR<MessageCreateWithoutClientInput, MessageUncheckedCreateWithoutClientInput>
  }

  export type MessageCreateManyClientInputEnvelope = {
    data: MessageCreateManyClientInput | MessageCreateManyClientInput[]
    skipDuplicates?: boolean
  }

  export type AccesUpsertWithWhereUniqueWithoutClientInput = {
    where: AccesWhereUniqueInput
    update: XOR<AccesUpdateWithoutClientInput, AccesUncheckedUpdateWithoutClientInput>
    create: XOR<AccesCreateWithoutClientInput, AccesUncheckedCreateWithoutClientInput>
  }

  export type AccesUpdateWithWhereUniqueWithoutClientInput = {
    where: AccesWhereUniqueInput
    data: XOR<AccesUpdateWithoutClientInput, AccesUncheckedUpdateWithoutClientInput>
  }

  export type AccesUpdateManyWithWhereWithoutClientInput = {
    where: AccesScalarWhereInput
    data: XOR<AccesUpdateManyMutationInput, AccesUncheckedUpdateManyWithoutClientInput>
  }

  export type AccesScalarWhereInput = {
    AND?: AccesScalarWhereInput | AccesScalarWhereInput[]
    OR?: AccesScalarWhereInput[]
    NOT?: AccesScalarWhereInput | AccesScalarWhereInput[]
    id?: StringFilter<"Acces"> | string
    clientId?: StringFilter<"Acces"> | string
    email?: StringFilter<"Acces"> | string
    motDePasseTemp?: StringNullableFilter<"Acces"> | string | null
    actif?: BoolFilter<"Acces"> | boolean
    premiereConnexion?: BoolFilter<"Acces"> | boolean
    createdAt?: DateTimeFilter<"Acces"> | Date | string
  }

  export type MessageUpsertWithWhereUniqueWithoutClientInput = {
    where: MessageWhereUniqueInput
    update: XOR<MessageUpdateWithoutClientInput, MessageUncheckedUpdateWithoutClientInput>
    create: XOR<MessageCreateWithoutClientInput, MessageUncheckedCreateWithoutClientInput>
  }

  export type MessageUpdateWithWhereUniqueWithoutClientInput = {
    where: MessageWhereUniqueInput
    data: XOR<MessageUpdateWithoutClientInput, MessageUncheckedUpdateWithoutClientInput>
  }

  export type MessageUpdateManyWithWhereWithoutClientInput = {
    where: MessageScalarWhereInput
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyWithoutClientInput>
  }

  export type MessageScalarWhereInput = {
    AND?: MessageScalarWhereInput | MessageScalarWhereInput[]
    OR?: MessageScalarWhereInput[]
    NOT?: MessageScalarWhereInput | MessageScalarWhereInput[]
    id?: StringFilter<"Message"> | string
    clientId?: StringNullableFilter<"Message"> | string | null
    nom?: StringFilter<"Message"> | string
    email?: StringFilter<"Message"> | string
    societe?: StringNullableFilter<"Message"> | string | null
    telephone?: StringNullableFilter<"Message"> | string | null
    outil?: StringFilter<"Message"> | string
    message?: StringFilter<"Message"> | string
    statut?: EnumMessageStatutFilter<"Message"> | $Enums.MessageStatut
    reponse?: StringNullableFilter<"Message"> | string | null
    createdAt?: DateTimeFilter<"Message"> | Date | string
    updatedAt?: DateTimeFilter<"Message"> | Date | string
  }

  export type ClientCreateWithoutAccesInput = {
    id?: string
    nom: string
    email: string
    telephone?: string | null
    societe?: string | null
    outil?: string
    statut?: $Enums.ClientStatut
    abonnement?: string | null
    trialDebutAt?: Date | string | null
    trialFinAt?: Date | string | null
    abonnementActif?: boolean
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    messages?: MessageCreateNestedManyWithoutClientInput
  }

  export type ClientUncheckedCreateWithoutAccesInput = {
    id?: string
    nom: string
    email: string
    telephone?: string | null
    societe?: string | null
    outil?: string
    statut?: $Enums.ClientStatut
    abonnement?: string | null
    trialDebutAt?: Date | string | null
    trialFinAt?: Date | string | null
    abonnementActif?: boolean
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    messages?: MessageUncheckedCreateNestedManyWithoutClientInput
  }

  export type ClientCreateOrConnectWithoutAccesInput = {
    where: ClientWhereUniqueInput
    create: XOR<ClientCreateWithoutAccesInput, ClientUncheckedCreateWithoutAccesInput>
  }

  export type ClientUpsertWithoutAccesInput = {
    update: XOR<ClientUpdateWithoutAccesInput, ClientUncheckedUpdateWithoutAccesInput>
    create: XOR<ClientCreateWithoutAccesInput, ClientUncheckedCreateWithoutAccesInput>
    where?: ClientWhereInput
  }

  export type ClientUpdateToOneWithWhereWithoutAccesInput = {
    where?: ClientWhereInput
    data: XOR<ClientUpdateWithoutAccesInput, ClientUncheckedUpdateWithoutAccesInput>
  }

  export type ClientUpdateWithoutAccesInput = {
    id?: StringFieldUpdateOperationsInput | string
    nom?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    telephone?: NullableStringFieldUpdateOperationsInput | string | null
    societe?: NullableStringFieldUpdateOperationsInput | string | null
    outil?: StringFieldUpdateOperationsInput | string
    statut?: EnumClientStatutFieldUpdateOperationsInput | $Enums.ClientStatut
    abonnement?: NullableStringFieldUpdateOperationsInput | string | null
    trialDebutAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialFinAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    abonnementActif?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: MessageUpdateManyWithoutClientNestedInput
  }

  export type ClientUncheckedUpdateWithoutAccesInput = {
    id?: StringFieldUpdateOperationsInput | string
    nom?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    telephone?: NullableStringFieldUpdateOperationsInput | string | null
    societe?: NullableStringFieldUpdateOperationsInput | string | null
    outil?: StringFieldUpdateOperationsInput | string
    statut?: EnumClientStatutFieldUpdateOperationsInput | $Enums.ClientStatut
    abonnement?: NullableStringFieldUpdateOperationsInput | string | null
    trialDebutAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialFinAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    abonnementActif?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: MessageUncheckedUpdateManyWithoutClientNestedInput
  }

  export type ClientCreateWithoutMessagesInput = {
    id?: string
    nom: string
    email: string
    telephone?: string | null
    societe?: string | null
    outil?: string
    statut?: $Enums.ClientStatut
    abonnement?: string | null
    trialDebutAt?: Date | string | null
    trialFinAt?: Date | string | null
    abonnementActif?: boolean
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    acces?: AccesCreateNestedManyWithoutClientInput
  }

  export type ClientUncheckedCreateWithoutMessagesInput = {
    id?: string
    nom: string
    email: string
    telephone?: string | null
    societe?: string | null
    outil?: string
    statut?: $Enums.ClientStatut
    abonnement?: string | null
    trialDebutAt?: Date | string | null
    trialFinAt?: Date | string | null
    abonnementActif?: boolean
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    acces?: AccesUncheckedCreateNestedManyWithoutClientInput
  }

  export type ClientCreateOrConnectWithoutMessagesInput = {
    where: ClientWhereUniqueInput
    create: XOR<ClientCreateWithoutMessagesInput, ClientUncheckedCreateWithoutMessagesInput>
  }

  export type ClientUpsertWithoutMessagesInput = {
    update: XOR<ClientUpdateWithoutMessagesInput, ClientUncheckedUpdateWithoutMessagesInput>
    create: XOR<ClientCreateWithoutMessagesInput, ClientUncheckedCreateWithoutMessagesInput>
    where?: ClientWhereInput
  }

  export type ClientUpdateToOneWithWhereWithoutMessagesInput = {
    where?: ClientWhereInput
    data: XOR<ClientUpdateWithoutMessagesInput, ClientUncheckedUpdateWithoutMessagesInput>
  }

  export type ClientUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    nom?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    telephone?: NullableStringFieldUpdateOperationsInput | string | null
    societe?: NullableStringFieldUpdateOperationsInput | string | null
    outil?: StringFieldUpdateOperationsInput | string
    statut?: EnumClientStatutFieldUpdateOperationsInput | $Enums.ClientStatut
    abonnement?: NullableStringFieldUpdateOperationsInput | string | null
    trialDebutAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialFinAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    abonnementActif?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    acces?: AccesUpdateManyWithoutClientNestedInput
  }

  export type ClientUncheckedUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    nom?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    telephone?: NullableStringFieldUpdateOperationsInput | string | null
    societe?: NullableStringFieldUpdateOperationsInput | string | null
    outil?: StringFieldUpdateOperationsInput | string
    statut?: EnumClientStatutFieldUpdateOperationsInput | $Enums.ClientStatut
    abonnement?: NullableStringFieldUpdateOperationsInput | string | null
    trialDebutAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialFinAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    abonnementActif?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    acces?: AccesUncheckedUpdateManyWithoutClientNestedInput
  }

  export type FinancePaymentCreateWithoutSubscriptionInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    status?: $Enums.FinancePaymentStatus
    method?: string | null
    gocardlessPaymentId?: string | null
    paidAt?: Date | string | null
    failedAt?: Date | string | null
    failureReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    invoice?: FinanceInvoiceCreateNestedOneWithoutPaymentsInput
  }

  export type FinancePaymentUncheckedCreateWithoutSubscriptionInput = {
    id?: string
    invoiceId?: string | null
    amount: Decimal | DecimalJsLike | number | string
    status?: $Enums.FinancePaymentStatus
    method?: string | null
    gocardlessPaymentId?: string | null
    paidAt?: Date | string | null
    failedAt?: Date | string | null
    failureReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FinancePaymentCreateOrConnectWithoutSubscriptionInput = {
    where: FinancePaymentWhereUniqueInput
    create: XOR<FinancePaymentCreateWithoutSubscriptionInput, FinancePaymentUncheckedCreateWithoutSubscriptionInput>
  }

  export type FinancePaymentCreateManySubscriptionInputEnvelope = {
    data: FinancePaymentCreateManySubscriptionInput | FinancePaymentCreateManySubscriptionInput[]
    skipDuplicates?: boolean
  }

  export type FinancePaymentUpsertWithWhereUniqueWithoutSubscriptionInput = {
    where: FinancePaymentWhereUniqueInput
    update: XOR<FinancePaymentUpdateWithoutSubscriptionInput, FinancePaymentUncheckedUpdateWithoutSubscriptionInput>
    create: XOR<FinancePaymentCreateWithoutSubscriptionInput, FinancePaymentUncheckedCreateWithoutSubscriptionInput>
  }

  export type FinancePaymentUpdateWithWhereUniqueWithoutSubscriptionInput = {
    where: FinancePaymentWhereUniqueInput
    data: XOR<FinancePaymentUpdateWithoutSubscriptionInput, FinancePaymentUncheckedUpdateWithoutSubscriptionInput>
  }

  export type FinancePaymentUpdateManyWithWhereWithoutSubscriptionInput = {
    where: FinancePaymentScalarWhereInput
    data: XOR<FinancePaymentUpdateManyMutationInput, FinancePaymentUncheckedUpdateManyWithoutSubscriptionInput>
  }

  export type FinancePaymentScalarWhereInput = {
    AND?: FinancePaymentScalarWhereInput | FinancePaymentScalarWhereInput[]
    OR?: FinancePaymentScalarWhereInput[]
    NOT?: FinancePaymentScalarWhereInput | FinancePaymentScalarWhereInput[]
    id?: StringFilter<"FinancePayment"> | string
    invoiceId?: StringNullableFilter<"FinancePayment"> | string | null
    subscriptionId?: StringNullableFilter<"FinancePayment"> | string | null
    amount?: DecimalFilter<"FinancePayment"> | Decimal | DecimalJsLike | number | string
    status?: EnumFinancePaymentStatusFilter<"FinancePayment"> | $Enums.FinancePaymentStatus
    method?: StringNullableFilter<"FinancePayment"> | string | null
    gocardlessPaymentId?: StringNullableFilter<"FinancePayment"> | string | null
    paidAt?: DateTimeNullableFilter<"FinancePayment"> | Date | string | null
    failedAt?: DateTimeNullableFilter<"FinancePayment"> | Date | string | null
    failureReason?: StringNullableFilter<"FinancePayment"> | string | null
    createdAt?: DateTimeFilter<"FinancePayment"> | Date | string
    updatedAt?: DateTimeFilter<"FinancePayment"> | Date | string
  }

  export type FinancePaymentCreateWithoutInvoiceInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    status?: $Enums.FinancePaymentStatus
    method?: string | null
    gocardlessPaymentId?: string | null
    paidAt?: Date | string | null
    failedAt?: Date | string | null
    failureReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    subscription?: RevenueSubscriptionCreateNestedOneWithoutPaymentsInput
  }

  export type FinancePaymentUncheckedCreateWithoutInvoiceInput = {
    id?: string
    subscriptionId?: string | null
    amount: Decimal | DecimalJsLike | number | string
    status?: $Enums.FinancePaymentStatus
    method?: string | null
    gocardlessPaymentId?: string | null
    paidAt?: Date | string | null
    failedAt?: Date | string | null
    failureReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FinancePaymentCreateOrConnectWithoutInvoiceInput = {
    where: FinancePaymentWhereUniqueInput
    create: XOR<FinancePaymentCreateWithoutInvoiceInput, FinancePaymentUncheckedCreateWithoutInvoiceInput>
  }

  export type FinancePaymentCreateManyInvoiceInputEnvelope = {
    data: FinancePaymentCreateManyInvoiceInput | FinancePaymentCreateManyInvoiceInput[]
    skipDuplicates?: boolean
  }

  export type FinancePaymentUpsertWithWhereUniqueWithoutInvoiceInput = {
    where: FinancePaymentWhereUniqueInput
    update: XOR<FinancePaymentUpdateWithoutInvoiceInput, FinancePaymentUncheckedUpdateWithoutInvoiceInput>
    create: XOR<FinancePaymentCreateWithoutInvoiceInput, FinancePaymentUncheckedCreateWithoutInvoiceInput>
  }

  export type FinancePaymentUpdateWithWhereUniqueWithoutInvoiceInput = {
    where: FinancePaymentWhereUniqueInput
    data: XOR<FinancePaymentUpdateWithoutInvoiceInput, FinancePaymentUncheckedUpdateWithoutInvoiceInput>
  }

  export type FinancePaymentUpdateManyWithWhereWithoutInvoiceInput = {
    where: FinancePaymentScalarWhereInput
    data: XOR<FinancePaymentUpdateManyMutationInput, FinancePaymentUncheckedUpdateManyWithoutInvoiceInput>
  }

  export type FinanceInvoiceCreateWithoutPaymentsInput = {
    id?: string
    invoiceNumber: string
    clientName: string
    clientCompany?: string | null
    tool: $Enums.FinanceTool
    amountHT: Decimal | DecimalJsLike | number | string
    vatAmount?: Decimal | DecimalJsLike | number | string
    amountTTC: Decimal | DecimalJsLike | number | string
    status?: $Enums.FinanceInvoiceStatus
    issueDate: Date | string
    dueDate?: Date | string | null
    paidAt?: Date | string | null
    pdfUrl?: string | null
    sageInvoiceId?: string | null
    sageInvoiceStatus?: string | null
    electronicInvoiceStatus?: $Enums.ElectronicInvoiceStatus
    platformProvider?: string | null
    platformInvoiceId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FinanceInvoiceUncheckedCreateWithoutPaymentsInput = {
    id?: string
    invoiceNumber: string
    clientName: string
    clientCompany?: string | null
    tool: $Enums.FinanceTool
    amountHT: Decimal | DecimalJsLike | number | string
    vatAmount?: Decimal | DecimalJsLike | number | string
    amountTTC: Decimal | DecimalJsLike | number | string
    status?: $Enums.FinanceInvoiceStatus
    issueDate: Date | string
    dueDate?: Date | string | null
    paidAt?: Date | string | null
    pdfUrl?: string | null
    sageInvoiceId?: string | null
    sageInvoiceStatus?: string | null
    electronicInvoiceStatus?: $Enums.ElectronicInvoiceStatus
    platformProvider?: string | null
    platformInvoiceId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FinanceInvoiceCreateOrConnectWithoutPaymentsInput = {
    where: FinanceInvoiceWhereUniqueInput
    create: XOR<FinanceInvoiceCreateWithoutPaymentsInput, FinanceInvoiceUncheckedCreateWithoutPaymentsInput>
  }

  export type RevenueSubscriptionCreateWithoutPaymentsInput = {
    id?: string
    clientName: string
    clientCompany?: string | null
    tool: $Enums.FinanceTool
    planName: string
    amountHT: Decimal | DecimalJsLike | number | string
    vatAmount?: Decimal | DecimalJsLike | number | string
    amountTTC: Decimal | DecimalJsLike | number | string
    frequency?: $Enums.FinanceFrequency
    status?: $Enums.RevenueStatus
    trialStartAt?: Date | string | null
    trialEndAt?: Date | string | null
    startDate: Date | string
    nextInvoiceAt?: Date | string | null
    nextPaymentAt?: Date | string | null
    gocardlessCustomerId?: string | null
    gocardlessMandateId?: string | null
    gocardlessSubscriptionId?: string | null
    sageCustomerId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RevenueSubscriptionUncheckedCreateWithoutPaymentsInput = {
    id?: string
    clientName: string
    clientCompany?: string | null
    tool: $Enums.FinanceTool
    planName: string
    amountHT: Decimal | DecimalJsLike | number | string
    vatAmount?: Decimal | DecimalJsLike | number | string
    amountTTC: Decimal | DecimalJsLike | number | string
    frequency?: $Enums.FinanceFrequency
    status?: $Enums.RevenueStatus
    trialStartAt?: Date | string | null
    trialEndAt?: Date | string | null
    startDate: Date | string
    nextInvoiceAt?: Date | string | null
    nextPaymentAt?: Date | string | null
    gocardlessCustomerId?: string | null
    gocardlessMandateId?: string | null
    gocardlessSubscriptionId?: string | null
    sageCustomerId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RevenueSubscriptionCreateOrConnectWithoutPaymentsInput = {
    where: RevenueSubscriptionWhereUniqueInput
    create: XOR<RevenueSubscriptionCreateWithoutPaymentsInput, RevenueSubscriptionUncheckedCreateWithoutPaymentsInput>
  }

  export type FinanceInvoiceUpsertWithoutPaymentsInput = {
    update: XOR<FinanceInvoiceUpdateWithoutPaymentsInput, FinanceInvoiceUncheckedUpdateWithoutPaymentsInput>
    create: XOR<FinanceInvoiceCreateWithoutPaymentsInput, FinanceInvoiceUncheckedCreateWithoutPaymentsInput>
    where?: FinanceInvoiceWhereInput
  }

  export type FinanceInvoiceUpdateToOneWithWhereWithoutPaymentsInput = {
    where?: FinanceInvoiceWhereInput
    data: XOR<FinanceInvoiceUpdateWithoutPaymentsInput, FinanceInvoiceUncheckedUpdateWithoutPaymentsInput>
  }

  export type FinanceInvoiceUpdateWithoutPaymentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    clientName?: StringFieldUpdateOperationsInput | string
    clientCompany?: NullableStringFieldUpdateOperationsInput | string | null
    tool?: EnumFinanceToolFieldUpdateOperationsInput | $Enums.FinanceTool
    amountHT?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    vatAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    amountTTC?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumFinanceInvoiceStatusFieldUpdateOperationsInput | $Enums.FinanceInvoiceStatus
    issueDate?: DateTimeFieldUpdateOperationsInput | Date | string
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    pdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    sageInvoiceId?: NullableStringFieldUpdateOperationsInput | string | null
    sageInvoiceStatus?: NullableStringFieldUpdateOperationsInput | string | null
    electronicInvoiceStatus?: EnumElectronicInvoiceStatusFieldUpdateOperationsInput | $Enums.ElectronicInvoiceStatus
    platformProvider?: NullableStringFieldUpdateOperationsInput | string | null
    platformInvoiceId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FinanceInvoiceUncheckedUpdateWithoutPaymentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceNumber?: StringFieldUpdateOperationsInput | string
    clientName?: StringFieldUpdateOperationsInput | string
    clientCompany?: NullableStringFieldUpdateOperationsInput | string | null
    tool?: EnumFinanceToolFieldUpdateOperationsInput | $Enums.FinanceTool
    amountHT?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    vatAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    amountTTC?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumFinanceInvoiceStatusFieldUpdateOperationsInput | $Enums.FinanceInvoiceStatus
    issueDate?: DateTimeFieldUpdateOperationsInput | Date | string
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    pdfUrl?: NullableStringFieldUpdateOperationsInput | string | null
    sageInvoiceId?: NullableStringFieldUpdateOperationsInput | string | null
    sageInvoiceStatus?: NullableStringFieldUpdateOperationsInput | string | null
    electronicInvoiceStatus?: EnumElectronicInvoiceStatusFieldUpdateOperationsInput | $Enums.ElectronicInvoiceStatus
    platformProvider?: NullableStringFieldUpdateOperationsInput | string | null
    platformInvoiceId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RevenueSubscriptionUpsertWithoutPaymentsInput = {
    update: XOR<RevenueSubscriptionUpdateWithoutPaymentsInput, RevenueSubscriptionUncheckedUpdateWithoutPaymentsInput>
    create: XOR<RevenueSubscriptionCreateWithoutPaymentsInput, RevenueSubscriptionUncheckedCreateWithoutPaymentsInput>
    where?: RevenueSubscriptionWhereInput
  }

  export type RevenueSubscriptionUpdateToOneWithWhereWithoutPaymentsInput = {
    where?: RevenueSubscriptionWhereInput
    data: XOR<RevenueSubscriptionUpdateWithoutPaymentsInput, RevenueSubscriptionUncheckedUpdateWithoutPaymentsInput>
  }

  export type RevenueSubscriptionUpdateWithoutPaymentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    clientName?: StringFieldUpdateOperationsInput | string
    clientCompany?: NullableStringFieldUpdateOperationsInput | string | null
    tool?: EnumFinanceToolFieldUpdateOperationsInput | $Enums.FinanceTool
    planName?: StringFieldUpdateOperationsInput | string
    amountHT?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    vatAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    amountTTC?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    frequency?: EnumFinanceFrequencyFieldUpdateOperationsInput | $Enums.FinanceFrequency
    status?: EnumRevenueStatusFieldUpdateOperationsInput | $Enums.RevenueStatus
    trialStartAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialEndAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    nextInvoiceAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextPaymentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gocardlessCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    gocardlessMandateId?: NullableStringFieldUpdateOperationsInput | string | null
    gocardlessSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    sageCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RevenueSubscriptionUncheckedUpdateWithoutPaymentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    clientName?: StringFieldUpdateOperationsInput | string
    clientCompany?: NullableStringFieldUpdateOperationsInput | string | null
    tool?: EnumFinanceToolFieldUpdateOperationsInput | $Enums.FinanceTool
    planName?: StringFieldUpdateOperationsInput | string
    amountHT?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    vatAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    amountTTC?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    frequency?: EnumFinanceFrequencyFieldUpdateOperationsInput | $Enums.FinanceFrequency
    status?: EnumRevenueStatusFieldUpdateOperationsInput | $Enums.RevenueStatus
    trialStartAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialEndAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    nextInvoiceAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextPaymentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gocardlessCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    gocardlessMandateId?: NullableStringFieldUpdateOperationsInput | string | null
    gocardlessSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    sageCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccesCreateManyClientInput = {
    id?: string
    email: string
    motDePasseTemp?: string | null
    actif?: boolean
    premiereConnexion?: boolean
    createdAt?: Date | string
  }

  export type MessageCreateManyClientInput = {
    id?: string
    nom: string
    email: string
    societe?: string | null
    telephone?: string | null
    outil?: string
    message: string
    statut?: $Enums.MessageStatut
    reponse?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccesUpdateWithoutClientInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    motDePasseTemp?: NullableStringFieldUpdateOperationsInput | string | null
    actif?: BoolFieldUpdateOperationsInput | boolean
    premiereConnexion?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccesUncheckedUpdateWithoutClientInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    motDePasseTemp?: NullableStringFieldUpdateOperationsInput | string | null
    actif?: BoolFieldUpdateOperationsInput | boolean
    premiereConnexion?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccesUncheckedUpdateManyWithoutClientInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    motDePasseTemp?: NullableStringFieldUpdateOperationsInput | string | null
    actif?: BoolFieldUpdateOperationsInput | boolean
    premiereConnexion?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageUpdateWithoutClientInput = {
    id?: StringFieldUpdateOperationsInput | string
    nom?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    societe?: NullableStringFieldUpdateOperationsInput | string | null
    telephone?: NullableStringFieldUpdateOperationsInput | string | null
    outil?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    statut?: EnumMessageStatutFieldUpdateOperationsInput | $Enums.MessageStatut
    reponse?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageUncheckedUpdateWithoutClientInput = {
    id?: StringFieldUpdateOperationsInput | string
    nom?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    societe?: NullableStringFieldUpdateOperationsInput | string | null
    telephone?: NullableStringFieldUpdateOperationsInput | string | null
    outil?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    statut?: EnumMessageStatutFieldUpdateOperationsInput | $Enums.MessageStatut
    reponse?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageUncheckedUpdateManyWithoutClientInput = {
    id?: StringFieldUpdateOperationsInput | string
    nom?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    societe?: NullableStringFieldUpdateOperationsInput | string | null
    telephone?: NullableStringFieldUpdateOperationsInput | string | null
    outil?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    statut?: EnumMessageStatutFieldUpdateOperationsInput | $Enums.MessageStatut
    reponse?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FinancePaymentCreateManySubscriptionInput = {
    id?: string
    invoiceId?: string | null
    amount: Decimal | DecimalJsLike | number | string
    status?: $Enums.FinancePaymentStatus
    method?: string | null
    gocardlessPaymentId?: string | null
    paidAt?: Date | string | null
    failedAt?: Date | string | null
    failureReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FinancePaymentUpdateWithoutSubscriptionInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumFinancePaymentStatusFieldUpdateOperationsInput | $Enums.FinancePaymentStatus
    method?: NullableStringFieldUpdateOperationsInput | string | null
    gocardlessPaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invoice?: FinanceInvoiceUpdateOneWithoutPaymentsNestedInput
  }

  export type FinancePaymentUncheckedUpdateWithoutSubscriptionInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceId?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumFinancePaymentStatusFieldUpdateOperationsInput | $Enums.FinancePaymentStatus
    method?: NullableStringFieldUpdateOperationsInput | string | null
    gocardlessPaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FinancePaymentUncheckedUpdateManyWithoutSubscriptionInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceId?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumFinancePaymentStatusFieldUpdateOperationsInput | $Enums.FinancePaymentStatus
    method?: NullableStringFieldUpdateOperationsInput | string | null
    gocardlessPaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FinancePaymentCreateManyInvoiceInput = {
    id?: string
    subscriptionId?: string | null
    amount: Decimal | DecimalJsLike | number | string
    status?: $Enums.FinancePaymentStatus
    method?: string | null
    gocardlessPaymentId?: string | null
    paidAt?: Date | string | null
    failedAt?: Date | string | null
    failureReason?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FinancePaymentUpdateWithoutInvoiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumFinancePaymentStatusFieldUpdateOperationsInput | $Enums.FinancePaymentStatus
    method?: NullableStringFieldUpdateOperationsInput | string | null
    gocardlessPaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subscription?: RevenueSubscriptionUpdateOneWithoutPaymentsNestedInput
  }

  export type FinancePaymentUncheckedUpdateWithoutInvoiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    subscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumFinancePaymentStatusFieldUpdateOperationsInput | $Enums.FinancePaymentStatus
    method?: NullableStringFieldUpdateOperationsInput | string | null
    gocardlessPaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FinancePaymentUncheckedUpdateManyWithoutInvoiceInput = {
    id?: StringFieldUpdateOperationsInput | string
    subscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: EnumFinancePaymentStatusFieldUpdateOperationsInput | $Enums.FinancePaymentStatus
    method?: NullableStringFieldUpdateOperationsInput | string | null
    gocardlessPaymentId?: NullableStringFieldUpdateOperationsInput | string | null
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}