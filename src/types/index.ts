export interface UserInfo {
  userId: string | number;
  username: string;
  realName: string;
  avatar: string;
  token: string;
  desc?: string;
  homePath?: string;
}

export interface ModelBase {
  id: number;
  create_time: Date;
  update_time?: Date;
}

export interface PageBase {
  currentPage: number;
  size: number;
  count?: boolean;
}

/**
 * 排序项接口
 */
export interface OrderItem {
  field: string;
  order: 'asc' | 'desc';
}

/**
 * 分页接口
 */
export interface PageQuery {
  current: number;
  pageSize: number;
  orders: OrderItem[];
}

/**
 * 基础查询接口
 */
export interface BaseQuery {
  current: number;
  pageSize: number;
  sorter?: string;

  buildPage(): PageQuery;
}

/**
 * 基础查询实现类
 */
export class BaseQueryImpl implements BaseQuery {
  // 排序常量
  private static readonly SORT_ASC = 'ascend';
  private static readonly SORT_DESC = 'descend';

  // 默认分页参数
  private static readonly DEFAULT_CURRENT = 1;
  private static readonly DEFAULT_PAGE_SIZE = 10;
  private static readonly MAX_PAGE_SIZE = 200;

  current: number;
  pageSize: number;
  sorter?: string;

  constructor(current?: number, pageSize?: number, sorter?: string) {
    this.current = current || BaseQueryImpl.DEFAULT_CURRENT;
    this.pageSize = pageSize || BaseQueryImpl.DEFAULT_PAGE_SIZE;
    this.sorter = sorter;
  }

  /**
   * 静态工厂方法，用于创建分页查询并返回 PageQuery 对象
   * @param current 当前页码
   * @param pageSize 每页大小
   * @param sorter 排序字符串，如 "field1_ascend,field2_descend"
   * @returns PageQuery 分页查询对象
   */
  static create(current?: number, pageSize?: number, sorter?: string): PageQuery {
    const query = new BaseQueryImpl(current, pageSize, sorter);
    return query.buildPage();
  }

  /**
   * 构建分页查询参数
   * @returns PageQuery 分页查询对象
   */
  buildPage(): PageQuery {
    // 确保 current 和 pageSize 在合理的范围内
    const validCurrent = this.current > 0 ? this.current : BaseQueryImpl.DEFAULT_CURRENT;
    const validPageSize = Math.min(this.pageSize, BaseQueryImpl.MAX_PAGE_SIZE);

    let orders: OrderItem[] | undefined = undefined;

    // 处理排序字段
    if (this.sorter) {
      orders = this.parseSorter(this.sorter);
    }

    return <PageQuery>{
      current: validCurrent,
      pageSize: validPageSize,
      orders,
    };
  }

  /**
   * 解析排序字符串
   * 示例 sorter 格式为： "field1_ascend,field2_descend"
   * @param sorter 排序字符串
   * @returns OrderItem[] 排序项数组
   */
  private parseSorter(sorter: string): OrderItem[] {
    return sorter.split(',').map((sort) => {
      const [field, order] = sort.split('_');
      if (!field || !order) {
        throw new Error(`Invalid sorter format: ${sort}`);
      }

      // 将字符串转换为 OrderItem 中的 'asc' 或 'desc'
      let normalizedOrder: 'asc' | 'desc';
      if (order === BaseQueryImpl.SORT_ASC) {
        normalizedOrder = 'asc';
      } else if (order === BaseQueryImpl.SORT_DESC) {
        normalizedOrder = 'desc';
      } else {
        throw new Error(`Invalid order direction: ${order}`);
      }

      return { field, order: normalizedOrder };
    });
  }
}

export interface PageResult<T> {
  /**
   * 总记录数
   */
  total: number;

  /**
   * 当前页的数据列表
   */
  records: T[];
}
