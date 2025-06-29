export interface DictTypePage {
    
    /** 主键 */
    id: string;
    
    /** 字典名称 */
    name: string;
    
    /** 字典类型 */
    type: string;
    
    /** 状态(1正常 0停用) */
    status: number;
    
    /** 备注 */
    comment: string;
    
    /** 创建时间 */
    create_time: string;
    
}

export interface DictTypeCreate {
    
    /** 字典名称 */
    name: string;
    
    /** 字典类型 */
    type: string;
    
    /** 状态(1正常 0停用) */
    status: number;
    
    /** 备注 */
    comment: string;
    
}

export interface DictTypeQuery {
    
    /** 主键 */
    id: string;
    
    /** 字典名称 */
    name: string;
    
    /** 字典类型 */
    type: string;
    
    /** 状态(1正常 0停用) */
    status: number;
    
    /** 创建时间 */
    create_time: string;
    
}

export interface DictTypeModify {
    
    /** 主键 */
    id: string;
    
    /** 字典名称 */
    name: string;
    
    /** 字典类型 */
    type: string;
    
    /** 状态(1正常 0停用) */
    status: number;
    
    /** 备注 */
    comment: string;
    
}

export interface DictTypeBatchModify {
    /** 主键列表 */
    ids: string[];
    
    /** 字典名称 */
    name: string;
    
    /** 字典类型 */
    type: string;
    
    /** 状态(1正常 0停用) */
    status: number;
    
    /** 备注 */
    comment: string;
    
}

export interface DictTypeDetail {
    
    /** 主键 */
    id: string;
    
    /** 字典名称 */
    name: string;
    
    /** 字典类型 */
    type: string;
    
    /** 状态(1正常 0停用) */
    status: number;
    
    /** 备注 */
    comment: string;
    
    /** 创建时间 */
    create_time: string;
    
}