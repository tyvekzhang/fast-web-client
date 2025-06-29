export interface UserRolePage {
    
    /** 自增编号 */
    id: string;
    
    /** 角色ID */
    role_id: string;
    
    /** 创建者 */
    creator: string;
    
    /** 创建时间 */
    create_time: string;
    
    /** 更新者 */
    updater: string;
    
    /** None */
    deleted: string;
    
}

export interface UserRoleCreate {
    
    /** 角色ID */
    role_id: string;
    
    /** 创建者 */
    creator: string;
    
    /** 更新者 */
    updater: string;
    
    /** None */
    deleted: string;
    
}

export interface UserRoleQuery {
    
    /** 自增编号 */
    id: string;
    
    /** 角色ID */
    role_id: string;
    
    /** 创建者 */
    creator: string;
    
    /** 创建时间 */
    create_time: string;
    
    /** 更新者 */
    updater: string;
    
    /** None */
    deleted: string;
    
}

export interface UserRoleModify {
    
    /** 自增编号 */
    id: string;
    
    /** 角色ID */
    role_id: string;
    
    /** 创建者 */
    creator: string;
    
    /** 更新者 */
    updater: string;
    
    /** None */
    deleted: string;
    
}

export interface UserRoleBatchModify {
    /** 主键列表 */
    ids: string[];
    
    /** 角色ID */
    role_id: string;
    
    /** 创建者 */
    creator: string;
    
    /** 更新者 */
    updater: string;
    
    /** None */
    deleted: string;
    
}

export interface UserRoleDetail {
    
    /** 自增编号 */
    id: string;
    
    /** 角色ID */
    role_id: string;
    
    /** 创建者 */
    creator: string;
    
    /** 创建时间 */
    create_time: string;
    
    /** 更新者 */
    updater: string;
    
    /** None */
    deleted: string;
    
}