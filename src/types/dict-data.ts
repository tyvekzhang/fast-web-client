export interface DictDataPage {

    /** 主键 */
    id: string;

    /** 字典排序 */
    sort: number;

    /** 字典标签 */
    label: string;

    /** 字典键值 */
    value: string;

    /** 字典类型 */
    type: string;

    /** 是否默认(1是 0否) */
    is_default: number;

    /** 状态(1正常 0停用) */
    status: number;

}

export interface DictDataCreate {

    /** 字典排序 */
    sort: number;

    /** 字典标签 */
    label: string;

    /** 字典键值 */
    value: string;

    /** 字典类型 */
    type: string;

    /** 回显样式 */
    echo_style: string;

    /** 扩展样式 */
    ext_class: string;

    /** 是否默认(1是 0否) */
    is_default: number;

    /** 状态(1正常 0停用) */
    status: number;

    /** 备注 */
    comment: string;

}

export interface DictDataQuery {

    /** 主键 */
    id: string;

    /** 字典排序 */
    sort: number;

    /** 字典标签 */
    label: string;

    /** 字典名称 */
    type: string;

    /** 是否默认(1是 0否) */
    is_default: number;

    /** 状态(1正常 0停用) */
    status: number;

}

export interface DictDataModify {

    /** 主键 */
    id: string;

    /** 字典排序 */
    sort: number;

    /** 字典标签 */
    label: string;

    /** 字典键值 */
    value: string;

    /** 字典类型 */
    type: string;

    /** 回显样式 */
    echo_style: string;

    /** 扩展样式 */
    ext_class: string;

    /** 是否默认(1是 0否) */
    is_default: number;

    /** 状态(1正常 0停用) */
    status: number;

    /** 备注 */
    comment: string;

}

export interface DictDataBatchModify {
    /** 主键列表 */
    ids: string[];

    /** 字典排序 */
    sort: number;

    /** 字典标签 */
    label: string;

    /** 字典键值 */
    value: string;

    /** 字典类型 */
    type: string;

    /** 回显样式 */
    echo_style: string;

    /** 扩展样式 */
    ext_class: string;

    /** 是否默认(1是 0否) */
    is_default: number;

    /** 状态(1正常 0停用) */
    status: number;

    /** 备注 */
    comment: string;

}

export interface DictDataDetail {

    /** 主键 */
    id: string;

    /** 字典排序 */
    sort: number;

    /** 字典标签 */
    label: string;

    /** 字典键值 */
    value: string;

    /** 字典类型 */
    type: string;

    /** 回显样式 */
    echo_style: string;

    /** 扩展样式 */
    ext_class: string;

    /** 是否默认(1是 0否) */
    is_default: number;

    /** 状态(1正常 0停用) */
    status: number;

    /** 备注 */
    comment: string;

    /** 创建时间 */
    create_time: string;

}
