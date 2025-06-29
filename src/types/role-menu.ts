export interface RoleMenuPage {
    
    /** 自增编号 */
    id: string;
    
    /** 角色ID */
    role_id: string;
    
    /** 菜单ID */
    menu_id: string;
    
    /** 创建者 */
    creator: string;
    
    /** 创建时间 */
    create_time: string;
    
    /** 更新者 */
    updater: string;
    
    /** None */
    deleted: string;
    
}

export interface RoleMenuCreate {
    
    /** 角色ID */
    role_id: string;
    
    /** 菜单ID */
    menu_id: string;
    
    /** 创建者 */
    creator: string;
    
    /** 更新者 */
    updater: string;
    
    /** None */
    deleted: string;
    
}

export interface RoleMenuQuery {
    
    /** 自增编号 */
    id: string;
    
    /** 角色ID */
    role_id: string;
    
    /** 菜单ID */
    menu_id: string;
    
    /** 创建者 */
    creator: string;
    
    /** 创建时间 */
    create_time: string;
    
    /** 更新者 */
    updater: string;
    
    /** None */
    deleted: string;
    
}

export interface RoleMenuModify {
    
    /** 自增编号 */
    id: string;
    
    /** 角色ID */
    role_id: string;
    
    /** 菜单ID */
    menu_id: string;
    
    /** 创建者 */
    creator: string;
    
    /** 更新者 */
    updater: string;
    
    /** None */
    deleted: string;
    
}

export interface RoleMenuBatchModify {
    /** 主键列表 */
    ids: string[];
    
    /** 角色ID */
    role_id: string;
    
    /** 菜单ID */
    menu_id: string;
    
    /** 创建者 */
    creator: string;
    
    /** 更新者 */
    updater: string;
    
    /** None */
    deleted: string;
    
}

export interface RoleMenuDetail {
    
    /** 自增编号 */
    id: string;
    
    /** 角色ID */
    role_id: string;
    
    /** 菜单ID */
    menu_id: string;
    
    /** 创建者 */
    creator: string;
    
    /** 创建时间 */
    create_time: string;
    
    /** 更新者 */
    updater: string;
    
    /** None */
    deleted: string;
    
}