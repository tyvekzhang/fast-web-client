export interface RolePage {

    /** 角色ID */
    id: string;

    /** 角色名称 */
    name: string;

    /** 角色权限字符串 */
    code: string;

    /** 显示顺序 */
    sort: number;

    /** 角色状态（0正常 1停用） */
    status: number;

    /** 备注 */
    comment: string;

    /** 创建时间 */
    create_time: string;

}

export interface RoleCreate {

    /** 角色名称 */
    name: string;

    /** 角色权限字符串 */
    code: string;

    /** 显示顺序 */
    sort: number;

    /** 数据范围（1：全部数据权限 2：自定数据权限 3：本部门数据权限 4：本部门及以下数据权限） */
    data_scope: number;

    /** 数据范围(指定部门数组) */
    data_scope_dept_ids: string;

    /** 角色状态（0正常 1停用） */
    status: number;

    /** 备注 */
    comment: string;

    /** 权限集合 */
    menu_ids: number[];

}

export interface RoleQuery {

    /** 角色名称 */
    name: string;

    /** 角色权限字符串 */
    code: string;

    /** 角色状态（0正常 1停用） */
    status: number;

    /** 创建时间 */
    create_time: string;

}

export interface RoleModify {

    /** 角色ID */
    id: string;

    /** 角色名称 */
    name: string;

    /** 角色权限字符串 */
    code: string;

    /** 显示顺序 */
    sort: number;

    /** 数据范围（1：全部数据权限 2：自定数据权限 3：本部门数据权限 4：本部门及以下数据权限） */
    data_scope: number;

    /** 数据范围(指定部门数组) */
    data_scope_dept_ids: string;

    /** 角色状态（0正常 1停用） */
    status: number;

    /** 备注 */
    comment: string;

}

export interface RoleBatchModify {
    /** 主键列表 */
    ids: string[];

    /** 角色名称 */
    name: string;

    /** 角色权限字符串 */
    code: string;

    /** 显示顺序 */
    sort: number;

    /** 数据范围（1：全部数据权限 2：自定数据权限 3：本部门数据权限 4：本部门及以下数据权限） */
    data_scope: number;

    /** 数据范围(指定部门数组) */
    data_scope_dept_ids: string;

    /** 角色状态（0正常 1停用） */
    status: number;

    /** 备注 */
    comment: string;

}

export interface RoleDetail {

    /** 角色ID */
    id: string;

    /** 角色名称 */
    name: string;

    /** 角色权限字符串 */
    code: string;

    /** 显示顺序 */
    sort: number;

    /** 数据范围（1：全部数据权限 2：自定数据权限 3：本部门数据权限 4：本部门及以下数据权限） */
    data_scope: number;

    /** 数据范围(指定部门数组) */
    data_scope_dept_ids: string;

    /** 角色状态（0正常 1停用） */
    status: number;

    /** 备注 */
    comment: string;

    /** 创建时间 */
    create_time: string;

}
