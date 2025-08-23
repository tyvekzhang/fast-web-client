'use client';

import { Badge, Empty, Input, Modal, Tooltip } from 'antd';
import * as LucideIcons from 'lucide-react';
import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';

// 扩展的图标映射，包含更多分类和图标
const iconMap = {
  // 基础操作 Basic Actions
  Copy: {
    name: '复制',
    englishName: 'Copy',
    category: '基础操作',
    keywords: ['复制', 'copy', '拷贝', '克隆'],
    icon: LucideIcons.Copy,
  },
  Clipboard: {
    name: '粘贴',
    englishName: 'Paste',
    category: '基础操作',
    keywords: ['粘贴', 'paste', '剪贴板'],
    icon: LucideIcons.Clipboard,
  },
  Undo: {
    name: '撤销',
    englishName: 'Undo',
    category: '基础操作',
    keywords: ['撤销', 'undo', '返回', '回退'],
    icon: LucideIcons.Undo,
  },
  Redo: {
    name: '重做',
    englishName: 'Redo',
    category: '基础操作',
    keywords: ['重做', 'redo', '恢复', '前进'],
    icon: LucideIcons.Redo,
  },
  Save: {
    name: '保存',
    englishName: 'Save',
    category: '基础操作',
    keywords: ['保存', 'save', '存储', '储存'],
    icon: LucideIcons.Save,
  },
  Download: {
    name: '下载',
    englishName: 'Download',
    category: '基础操作',
    keywords: ['下载', 'download', '获取', '导出'],
    icon: LucideIcons.Download,
  },
  Upload: {
    name: '上传',
    englishName: 'Upload',
    category: '基础操作',
    keywords: ['上传', 'upload', '提交', '导入'],
    icon: LucideIcons.Upload,
  },
  Import: {
    name: '导入',
    englishName: 'Import',
    category: '基础操作',
    keywords: ['导入', 'import', '引入', '加载'],
    icon: LucideIcons.Import,
  },
  Printer: {
    name: '打印',
    englishName: 'Print',
    category: '基础操作',
    keywords: ['打印', 'print', '输出', '打印机'],
    icon: LucideIcons.Printer,
  },
  Share: {
    name: '分享',
    englishName: 'Share',
    category: '基础操作',
    keywords: ['分享', 'share', '共享', '传播'],
    icon: LucideIcons.Share,
  },
  Link: {
    name: '链接',
    englishName: 'Link',
    category: '基础操作',
    keywords: ['链接', 'link', '连接', '网址'],
    icon: LucideIcons.Link,
  },
  Unlink: {
    name: '取消链接',
    englishName: 'Unlink',
    category: '基础操作',
    keywords: ['取消链接', 'unlink', '断开', '解除'],
    icon: LucideIcons.Unlink,
  },
  Edit: {
    name: '编辑',
    englishName: 'Edit',
    category: '基础操作',
    keywords: ['编辑', 'edit', '修改', '更改'],
    icon: LucideIcons.Edit,
  },
  Trash2: {
    name: '删除',
    englishName: 'Delete',
    category: '基础操作',
    keywords: ['删除', 'delete', '移除', '清除'],
    icon: LucideIcons.Trash2,
  },
  Plus: {
    name: '添加',
    englishName: 'Add',
    category: '基础操作',
    keywords: ['添加', 'add', '新增', '创建'],
    icon: LucideIcons.Plus,
  },
  Minus: {
    name: '移除',
    englishName: 'Remove',
    category: '基础操作',
    keywords: ['移除', 'remove', '删除', '减少'],
    icon: LucideIcons.Minus,
  },

  // 导航箭头 Navigation & Arrows
  ArrowUp: {
    name: '向上箭头',
    englishName: 'Arrow Up',
    category: '导航箭头',
    keywords: ['向上', 'arrow', 'up', '箭头', '上'],
    icon: LucideIcons.ArrowUp,
  },
  ArrowDown: {
    name: '向下箭头',
    englishName: 'Arrow Down',
    category: '导航箭头',
    keywords: ['向下', 'arrow', 'down', '箭头', '下'],
    icon: LucideIcons.ArrowDown,
  },
  ArrowLeft: {
    name: '向左箭头',
    englishName: 'Arrow Left',
    category: '导航箭头',
    keywords: ['向左', 'arrow', 'left', '箭头', '左'],
    icon: LucideIcons.ArrowLeft,
  },
  ArrowRight: {
    name: '向右箭头',
    englishName: 'Arrow Right',
    category: '导航箭头',
    keywords: ['向右', 'arrow', 'right', '箭头', '右'],
    icon: LucideIcons.ArrowRight,
  },
  ChevronUp: {
    name: '向上',
    englishName: 'Chevron Up',
    category: '导航箭头',
    keywords: ['向上', 'chevron', 'up', '折叠'],
    icon: LucideIcons.ChevronUp,
  },
  ChevronDown: {
    name: '向下',
    englishName: 'Chevron Down',
    category: '导航箭头',
    keywords: ['向下', 'chevron', 'down', '展开'],
    icon: LucideIcons.ChevronDown,
  },
  ChevronLeft: {
    name: '向左',
    englishName: 'Chevron Left',
    category: '导航箭头',
    keywords: ['向左', 'chevron', 'left', '返回'],
    icon: LucideIcons.ChevronLeft,
  },
  ChevronRight: {
    name: '向右',
    englishName: 'Chevron Right',
    category: '导航箭头',
    keywords: ['向右', 'chevron', 'right', '前进'],
    icon: LucideIcons.ChevronRight,
  },
  ChevronsUp: {
    name: '双向上',
    englishName: 'Double Chevron Up',
    category: '导航箭头',
    keywords: ['双向上', 'chevrons', 'up', '顶部'],
    icon: LucideIcons.ChevronsUp,
  },
  ChevronsDown: {
    name: '双向下',
    englishName: 'Double Chevron Down',
    category: '导航箭头',
    keywords: ['双向下', 'chevrons', 'down', '底部'],
    icon: LucideIcons.ChevronsDown,
  },
  ChevronsLeft: {
    name: '双向左',
    englishName: 'Double Chevron Left',
    category: '导航箭头',
    keywords: ['双向左', 'chevrons', 'left', '最左'],
    icon: LucideIcons.ChevronsLeft,
  },
  ChevronsRight: {
    name: '双向右',
    englishName: 'Double Chevron Right',
    category: '导航箭头',
    keywords: ['双向右', 'chevrons', 'right', '最右'],
    icon: LucideIcons.ChevronsRight,
  },
  ArrowUpRight: {
    name: '右上箭头',
    englishName: 'Arrow Up Right',
    category: '导航箭头',
    keywords: ['右上', 'arrow', 'diagonal', '外链'],
    icon: LucideIcons.ArrowUpRight,
  },
  ArrowUpLeft: {
    name: '左上箭头',
    englishName: 'Arrow Up Left',
    category: '导航箭头',
    keywords: ['左上', 'arrow', 'diagonal'],
    icon: LucideIcons.ArrowUpLeft,
  },
  ArrowDownRight: {
    name: '右下箭头',
    englishName: 'Arrow Down Right',
    category: '导航箭头',
    keywords: ['右下', 'arrow', 'diagonal'],
    icon: LucideIcons.ArrowDownRight,
  },
  ArrowDownLeft: {
    name: '左下箭头',
    englishName: 'Arrow Down Left',
    category: '导航箭头',
    keywords: ['左下', 'arrow', 'diagonal'],
    icon: LucideIcons.ArrowDownLeft,
  },

  // 基础UI元素 Basic UI Elements
  X: {
    name: '关闭',
    englishName: 'Close',
    category: '基础UI',
    keywords: ['关闭', 'close', 'x', '取消', '删除'],
    icon: LucideIcons.X,
  },
  Check: {
    name: '勾选',
    englishName: 'Check',
    category: '基础UI',
    keywords: ['勾选', 'check', '确认', '完成', '对勾'],
    icon: LucideIcons.Check,
  },
  CheckCircle: {
    name: '勾选圆圈',
    englishName: 'Check Circle',
    category: '基础UI',
    keywords: ['勾选', 'check', 'circle', '成功', '完成'],
    icon: LucideIcons.CheckCircle,
  },
  XCircle: {
    name: '错误圆圈',
    englishName: 'X Circle',
    category: '基础UI',
    keywords: ['错误', 'x', 'circle', '失败', '取消'],
    icon: LucideIcons.XCircle,
  },
  AlertCircle: {
    name: '警告圆圈',
    englishName: 'Alert Circle',
    category: '基础UI',
    keywords: ['警告', 'alert', 'circle', '提醒', '注意'],
    icon: LucideIcons.AlertCircle,
  },
  AlertTriangle: {
    name: '警告三角',
    englishName: 'Alert Triangle',
    category: '基础UI',
    keywords: ['警告', 'alert', 'triangle', '注意', '危险'],
    icon: LucideIcons.AlertTriangle,
  },
  Info: {
    name: '信息',
    englishName: 'Info',
    category: '基础UI',
    keywords: ['信息', 'info', '提示', '说明'],
    icon: LucideIcons.Info,
  },
  HelpCircle: {
    name: '帮助',
    englishName: 'Help Circle',
    category: '基础UI',
    keywords: ['帮助', 'help', '问号', '支持', '疑问'],
    icon: LucideIcons.HelpCircle,
  },
  MoreHorizontal: {
    name: '更多横向',
    englishName: 'More Horizontal',
    category: '基础UI',
    keywords: ['更多', 'more', 'horizontal', '选项', '菜单'],
    icon: LucideIcons.MoreHorizontal,
  },
  MoreVertical: {
    name: '更多纵向',
    englishName: 'More Vertical',
    category: '基础UI',
    keywords: ['更多', 'more', 'vertical', '选项', '菜单'],
    icon: LucideIcons.MoreVertical,
  },
  Loader: {
    name: '加载中',
    englishName: 'Loading',
    category: '基础UI',
    keywords: ['加载', 'loading', '等待', '处理', '转圈'],
    icon: LucideIcons.Loader,
  },
  Loader2: {
    name: '加载动画',
    englishName: 'Loading Animation',
    category: '基础UI',
    keywords: ['加载', 'loading', 'spinner', '旋转'],
    icon: LucideIcons.Loader2,
  },

  // 用户相关 User & People
  User: {
    name: '用户',
    englishName: 'User',
    category: '用户相关',
    keywords: ['用户', 'user', '人员', '个人', '账户'],
    icon: LucideIcons.User,
  },
  Users: {
    name: '用户组',
    englishName: 'Users',
    category: '用户相关',
    keywords: ['用户组', 'users', '团队', '群组', '多人'],
    icon: LucideIcons.Users,
  },
  UserPlus: {
    name: '添加用户',
    englishName: 'Add User',
    category: '用户相关',
    keywords: ['添加用户', 'user', 'plus', '新增', '邀请'],
    icon: LucideIcons.UserPlus,
  },
  UserMinus: {
    name: '删除用户',
    englishName: 'Remove User',
    category: '用户相关',
    keywords: ['删除用户', 'user', 'minus', '移除', '踢出'],
    icon: LucideIcons.UserMinus,
  },
  UserCheck: {
    name: '用户确认',
    englishName: 'User Check',
    category: '用户相关',
    keywords: ['用户确认', 'user', 'check', '验证', '认证'],
    icon: LucideIcons.UserCheck,
  },
  UserX: {
    name: '用户拒绝',
    englishName: 'User X',
    category: '用户相关',
    keywords: ['用户拒绝', 'user', 'x', '禁用', '封禁'],
    icon: LucideIcons.UserX,
  },
  UserCircle: {
    name: '用户头像',
    englishName: 'User Circle',
    category: '用户相关',
    keywords: ['用户头像', 'user', 'circle', '头像', '个人'],
    icon: LucideIcons.UserCircle,
  },
  UserCog: {
    name: '用户设置',
    englishName: 'User Settings',
    category: '用户相关',
    keywords: ['用户设置', 'user', 'settings', '配置'],
    icon: LucideIcons.UserCog,
  },
  Crown: {
    name: '皇冠',
    englishName: 'Crown',
    category: '用户相关',
    keywords: ['皇冠', 'crown', '管理员', '权限', 'VIP'],
    icon: LucideIcons.Crown,
  },
  Shield: {
    name: '盾牌',
    englishName: 'Shield',
    category: '用户相关',
    keywords: ['盾牌', 'shield', '安全', '保护', '防护'],
    icon: LucideIcons.Shield,
  },
  ShieldCheck: {
    name: '安全认证',
    englishName: 'Shield Check',
    category: '用户相关',
    keywords: ['安全认证', 'shield', 'check', '验证', '安全'],
    icon: LucideIcons.ShieldCheck,
  },
  Contact: {
    name: '联系人',
    englishName: 'Contact',
    category: '用户相关',
    keywords: ['联系人', 'contact', '通讯录', '地址簿'],
    icon: LucideIcons.Contact,
  },

  // 通讯 Communication
  Mail: {
    name: '邮件',
    englishName: 'Mail',
    category: '通讯',
    keywords: ['邮件', 'mail', 'email', '消息', '信件'],
    icon: LucideIcons.Mail,
  },
  MailOpen: {
    name: '打开邮件',
    englishName: 'Mail Open',
    category: '通讯',
    keywords: ['打开邮件', 'mail', 'open', '已读', '查看'],
    icon: LucideIcons.MailOpen,
  },
  Send: {
    name: '发送',
    englishName: 'Send',
    category: '通讯',
    keywords: ['发送', 'send', '提交', '传送', '投递'],
    icon: LucideIcons.Send,
  },
  MessageCircle: {
    name: '消息',
    englishName: 'Message Circle',
    category: '通讯',
    keywords: ['消息', 'message', '聊天', '对话', '沟通'],
    icon: LucideIcons.MessageCircle,
  },
  MessageSquare: {
    name: '消息框',
    englishName: 'Message Square',
    category: '通讯',
    keywords: ['消息框', 'message', 'square', '评论', '留言'],
    icon: LucideIcons.MessageSquare,
  },
  Phone: {
    name: '电话',
    englishName: 'Phone',
    category: '通讯',
    keywords: ['电话', 'phone', '通话', '联系', '呼叫'],
    icon: LucideIcons.Phone,
  },
  PhoneCall: {
    name: '通话',
    englishName: 'Phone Call',
    category: '通讯',
    keywords: ['通话', 'phone', 'call', '拨打', '接听'],
    icon: LucideIcons.PhoneCall,
  },
  PhoneIncoming: {
    name: '来电',
    englishName: 'Phone Incoming',
    category: '通讯',
    keywords: ['来电', 'phone', 'incoming', '接听'],
    icon: LucideIcons.PhoneIncoming,
  },
  PhoneOutgoing: {
    name: '拨出',
    englishName: 'Phone Outgoing',
    category: '通讯',
    keywords: ['拨出', 'phone', 'outgoing', '拨打'],
    icon: LucideIcons.PhoneOutgoing,
  },
  PhoneOff: {
    name: '挂断',
    englishName: 'Phone Off',
    category: '通讯',
    keywords: ['挂断', 'phone', 'off', '结束'],
    icon: LucideIcons.PhoneOff,
  },
  Video: {
    name: '视频',
    englishName: 'Video',
    category: '通讯',
    keywords: ['视频', 'video', '摄像', '录制', '会议'],
    icon: LucideIcons.Video,
  },
  VideoOff: {
    name: '关闭视频',
    englishName: 'Video Off',
    category: '通讯',
    keywords: ['关闭视频', 'video', 'off', '禁用'],
    icon: LucideIcons.VideoOff,
  },
  Mic: {
    name: '麦克风',
    englishName: 'Microphone',
    category: '通讯',
    keywords: ['麦克风', 'mic', '录音', '语音', '声音'],
    icon: LucideIcons.Mic,
  },
  MicOff: {
    name: '关闭麦克风',
    englishName: 'Microphone Off',
    category: '通讯',
    keywords: ['关闭麦克风', 'mic', 'off', '静音', '禁音'],
    icon: LucideIcons.MicOff,
  },
  Voicemail: {
    name: '语音邮件',
    englishName: 'Voicemail',
    category: '通讯',
    keywords: ['语音邮件', 'voicemail', '留言', '录音'],
    icon: LucideIcons.Voicemail,
  },

  // 文件和文件夹 Files & Folders
  File: {
    name: '文件',
    englishName: 'File',
    category: '文件',
    keywords: ['文件', 'file', '文档', '资料', '档案'],
    icon: LucideIcons.File,
  },
  FileText: {
    name: '文本文件',
    englishName: 'File Text',
    category: '文件',
    keywords: ['文本文件', 'file', 'text', '文档', 'txt'],
    icon: LucideIcons.FileText,
  },
  FileImage: {
    name: '图片文件',
    englishName: 'File Image',
    category: '文件',
    keywords: ['图片文件', 'file', 'image', '照片', '图像'],
    icon: LucideIcons.FileImage,
  },
  FileVideo: {
    name: '视频文件',
    englishName: 'File Video',
    category: '文件',
    keywords: ['视频文件', 'file', 'video', '影片', '电影'],
    icon: LucideIcons.FileVideo,
  },
  FileAudio: {
    name: '音频文件',
    englishName: 'File Audio',
    category: '文件',
    keywords: ['音频文件', 'file', 'audio', '音乐', '声音'],
    icon: LucideIcons.FileAudio,
  },
  FileCode: {
    name: '代码文件',
    englishName: 'File Code',
    category: '文件',
    keywords: ['代码文件', 'file', 'code', '程序', '脚本'],
    icon: LucideIcons.FileCode,
  },
  FileSpreadsheet: {
    name: '表格文件',
    englishName: 'Spreadsheet',
    category: '文件',
    keywords: ['表格文件', 'spreadsheet', 'excel', '数据'],
    icon: LucideIcons.FileSpreadsheet,
  },
  FileArchive: {
    name: '压缩文件',
    englishName: 'Archive File',
    category: '文件',
    keywords: ['压缩文件', 'archive', 'zip', '压缩'],
    icon: LucideIcons.FileArchive,
  },
  Folder: {
    name: '文件夹',
    englishName: 'Folder',
    category: '文件',
    keywords: ['文件夹', 'folder', '目录', '分类', '文件夹'],
    icon: LucideIcons.Folder,
  },
  FolderOpen: {
    name: '打开文件夹',
    englishName: 'Folder Open',
    category: '文件',
    keywords: ['打开文件夹', 'folder', 'open', '展开'],
    icon: LucideIcons.FolderOpen,
  },
  FolderPlus: {
    name: '新建文件夹',
    englishName: 'Add Folder',
    category: '文件',
    keywords: ['新建文件夹', 'folder', 'plus', '创建'],
    icon: LucideIcons.FolderPlus,
  },
  FolderMinus: {
    name: '删除文件夹',
    englishName: 'Remove Folder',
    category: '文件',
    keywords: ['删除文件夹', 'folder', 'minus', '移除'],
    icon: LucideIcons.FolderMinus,
  },
  Archive: {
    name: '归档',
    englishName: 'Archive',
    category: '文件',
    keywords: ['归档', 'archive', '压缩', '存档', '打包'],
    icon: LucideIcons.Archive,
  },
  HardDrive: {
    name: '硬盘',
    englishName: 'Hard Drive',
    category: '文件',
    keywords: ['硬盘', 'hard drive', '存储', '磁盘'],
    icon: LucideIcons.HardDrive,
  },

  // 媒体控制 Media Controls
  Play: {
    name: '播放',
    englishName: 'Play',
    category: '媒体控制',
    keywords: ['播放', 'play', '开始', '运行', '启动'],
    icon: LucideIcons.Play,
  },
  Pause: {
    name: '暂停',
    englishName: 'Pause',
    category: '媒体控制',
    keywords: ['暂停', 'pause', '停止', '中断'],
    icon: LucideIcons.Pause,
  },
  Square: {
    name: '停止',
    englishName: 'Stop',
    category: '媒体控制',
    keywords: ['停止', 'stop', '结束', '终止'],
    icon: LucideIcons.Square,
  },
  SkipBack: {
    name: '上一个',
    englishName: 'Skip Back',
    category: '媒体控制',
    keywords: ['上一个', 'skip', 'back', '前一个', '后退'],
    icon: LucideIcons.SkipBack,
  },
  SkipForward: {
    name: '下一个',
    englishName: 'Skip Forward',
    category: '媒体控制',
    keywords: ['下一个', 'skip', 'forward', '后一个', '前进'],
    icon: LucideIcons.SkipForward,
  },
  Rewind: {
    name: '快退',
    englishName: 'Rewind',
    category: '媒体控制',
    keywords: ['快退', 'rewind', '倒退', '回放'],
    icon: LucideIcons.Rewind,
  },
  FastForward: {
    name: '快进',
    englishName: 'Fast Forward',
    category: '媒体控制',
    keywords: ['快进', 'fast forward', '加速', '前进'],
    icon: LucideIcons.FastForward,
  },
  Volume2: {
    name: '音量',
    englishName: 'Volume',
    category: '媒体控制',
    keywords: ['音量', 'volume', '声音', '音响'],
    icon: LucideIcons.Volume2,
  },
  Volume1: {
    name: '低音量',
    englishName: 'Volume Low',
    category: '媒体控制',
    keywords: ['低音量', 'volume', 'low', '小声'],
    icon: LucideIcons.Volume1,
  },
  VolumeX: {
    name: '静音',
    englishName: 'Volume Mute',
    category: '媒体控制',
    keywords: ['静音', 'volume', 'mute', '关闭声音'],
    icon: LucideIcons.VolumeX,
  },
  Radio: {
    name: '收音机',
    englishName: 'Radio',
    category: '媒体控制',
    keywords: ['收音机', 'radio', '广播', '电台'],
    icon: LucideIcons.Radio,
  },
  Repeat: {
    name: '重复',
    englishName: 'Repeat',
    category: '媒体控制',
    keywords: ['重复', 'repeat', '循环', '再次'],
    icon: LucideIcons.Repeat,
  },
  Shuffle: {
    name: '随机',
    englishName: 'Shuffle',
    category: '媒体控制',
    keywords: ['随机', 'shuffle', '打乱', '混合'],
    icon: LucideIcons.Shuffle,
  },

  // 设置配置 Settings & Configuration
  Settings: {
    name: '设置',
    englishName: 'Settings',
    category: '设置配置',
    keywords: ['设置', 'settings', '配置', '选项', '参数'],
    icon: LucideIcons.Settings,
  },
  Settings2: {
    name: '设置2',
    englishName: 'Settings 2',
    category: '设置配置',
    keywords: ['设置', 'settings', '配置', '齿轮'],
    icon: LucideIcons.Settings2,
  },
  Cog: {
    name: '齿轮',
    englishName: 'Cog',
    category: '设置配置',
    keywords: ['齿轮', 'cog', '设置', '机械'],
    icon: LucideIcons.Cog,
  },
  Sliders: {
    name: '滑块',
    englishName: 'Sliders',
    category: '设置配置',
    keywords: ['滑块', 'sliders', '调节', '控制', '参数'],
    icon: LucideIcons.Sliders,
  },
  SlidersHorizontal: {
    name: '水平滑块',
    englishName: 'Horizontal Sliders',
    category: '设置配置',
    keywords: ['水平滑块', 'sliders', 'horizontal', '调节'],
    icon: LucideIcons.SlidersHorizontal,
  },
  ToggleLeft: {
    name: '开关关闭',
    englishName: 'Toggle Off',
    category: '设置配置',
    keywords: ['开关', 'toggle', 'off', '关闭', '禁用'],
    icon: LucideIcons.ToggleLeft,
  },
  ToggleRight: {
    name: '开关打开',
    englishName: 'Toggle On',
    category: '设置配置',
    keywords: ['开关', 'toggle', 'on', '打开', '启用'],
    icon: LucideIcons.ToggleRight,
  },
  Filter: {
    name: '过滤',
    englishName: 'Filter',
    category: '设置配置',
    keywords: ['过滤', 'filter', '筛选', '搜索', '条件'],
    icon: LucideIcons.Filter,
  },
  Search: {
    name: '搜索',
    englishName: 'Search',
    category: '设置配置',
    keywords: ['搜索', 'search', '查找', '寻找', '检索'],
    icon: LucideIcons.Search,
  },
  ScanLine: {
    name: '扫描',
    englishName: 'Scan Line',
    category: '设置配置',
    keywords: ['扫描', 'scan', 'line', '检测'],
    icon: LucideIcons.ScanLine,
  },
  Wrench: {
    name: '扳手',
    englishName: 'Wrench',
    category: '设置配置',
    keywords: ['扳手', 'wrench', '工具', '修理', '维护'],
    icon: LucideIcons.Wrench,
  },

  // 安全隐私 Security & Privacy
  Lock: {
    name: '锁定',
    englishName: 'Lock',
    category: '安全隐私',
    keywords: ['锁定', 'lock', '安全', '保护', '加密'],
    icon: LucideIcons.Lock,
  },
  Unlock: {
    name: '解锁',
    englishName: 'Unlock',
    category: '安全隐私',
    keywords: ['解锁', 'unlock', '开放', '访问', '解密'],
    icon: LucideIcons.Unlock,
  },
  Key: {
    name: '钥匙',
    englishName: 'Key',
    category: '安全隐私',
    keywords: ['钥匙', 'key', '密码', '认证', '密钥'],
    icon: LucideIcons.Key,
  },
  KeyRound: {
    name: '圆形钥匙',
    englishName: 'Round Key',
    category: '安全隐私',
    keywords: ['圆形钥匙', 'key', 'round', '密钥'],
    icon: LucideIcons.KeyRound,
  },
  Eye: {
    name: '查看',
    englishName: 'Eye',
    category: '安全隐私',
    keywords: ['查看', 'eye', '显示', '可见', '观看'],
    icon: LucideIcons.Eye,
  },
  EyeOff: {
    name: '隐藏',
    englishName: 'Eye Off',
    category: '安全隐私',
    keywords: ['隐藏', 'eye', 'off', '不可见', '遮挡'],
    icon: LucideIcons.EyeOff,
  },
  Fingerprint: {
    name: '指纹',
    englishName: 'Fingerprint',
    category: '安全隐私',
    keywords: ['指纹', 'fingerprint', '生物识别', '认证'],
    icon: LucideIcons.Fingerprint,
  },
  ShieldAlert: {
    name: '安全警告',
    englishName: 'Shield Alert',
    category: '安全隐私',
    keywords: ['安全警告', 'shield', 'alert', '危险'],
    icon: LucideIcons.ShieldAlert,
  },
  ShieldX: {
    name: '安全拒绝',
    englishName: 'Shield X',
    category: '安全隐私',
    keywords: ['安全拒绝', 'shield', 'x', '阻止'],
    icon: LucideIcons.ShieldX,
  },

  // 导航 Home & Navigation
  Home: {
    name: '首页',
    englishName: 'Home',
    category: '导航',
    keywords: ['首页', 'home', '主页', '开始', '房子'],
    icon: LucideIcons.Home,
  },
  Menu: {
    name: '菜单',
    englishName: 'Menu',
    category: '导航',
    keywords: ['菜单', 'menu', '导航', '列表', '汉堡'],
    icon: LucideIcons.Menu,
  },
  Navigation: {
    name: '导航',
    englishName: 'Navigation',
    category: '导航',
    keywords: ['导航', 'navigation', '指南针', '方向'],
    icon: LucideIcons.Navigation,
  },
  Navigation2: {
    name: '导航2',
    englishName: 'Navigation 2',
    category: '导航',
    keywords: ['导航', 'navigation', '箭头', '方向'],
    icon: LucideIcons.Navigation2,
  },
  Compass: {
    name: '指南针',
    englishName: 'Compass',
    category: '导航',
    keywords: ['指南针', 'compass', '方向', '导航'],
    icon: LucideIcons.Compass,
  },
  Grid3X3: {
    name: '网格',
    englishName: 'Grid',
    category: '导航',
    keywords: ['网格', 'grid', '布局', '排列', '九宫格'],
    icon: LucideIcons.Grid3X3,
  },
  List: {
    name: '列表',
    englishName: 'List',
    category: '导航',
    keywords: ['列表', 'list', '清单', '项目', '条目'],
    icon: LucideIcons.List,
  },
  PanelLeft: {
    name: '侧边栏',
    englishName: 'Sidebar',
    category: '导航',
    keywords: ['侧边栏', 'sidebar', '面板', '导航栏'],
    icon: LucideIcons.PanelLeft,
  },
  PanelRight: {
    name: '右面板',
    englishName: 'Panel Right',
    category: '导航',
    keywords: ['右面板', 'panel', 'right', '侧栏'],
    icon: LucideIcons.PanelRight,
  },
  PanelTop: {
    name: '顶部面板',
    englishName: 'Panel Top',
    category: '导航',
    keywords: ['顶部面板', 'panel', 'top', '头部'],
    icon: LucideIcons.PanelTop,
  },
  PanelBottom: {
    name: '底部面板',
    englishName: 'Panel Bottom',
    category: '导航',
    keywords: ['底部面板', 'panel', 'bottom', '底部'],
    icon: LucideIcons.PanelBottom,
  },

  // 购物商务 Shopping & Commerce
  ShoppingCart: {
    name: '购物车',
    englishName: 'Shopping Cart',
    category: '购物商务',
    keywords: ['购物车', 'shopping', 'cart', '购买', '商品'],
    icon: LucideIcons.ShoppingCart,
  },
  ShoppingBag: {
    name: '购物袋',
    englishName: 'Shopping Bag',
    category: '购物商务',
    keywords: ['购物袋', 'shopping', 'bag', '商品', '包装'],
    icon: LucideIcons.ShoppingBag,
  },
  CreditCard: {
    name: '信用卡',
    englishName: 'Credit Card',
    category: '购物商务',
    keywords: ['信用卡', 'credit', 'card', '支付', '银行卡'],
    icon: LucideIcons.CreditCard,
  },
  DollarSign: {
    name: '美元',
    englishName: 'Dollar Sign',
    category: '购物商务',
    keywords: ['美元', 'dollar', '金钱', '价格', '货币'],
    icon: LucideIcons.DollarSign,
  },
  Euro: {
    name: '欧元',
    englishName: 'Euro',
    category: '购物商务',
    keywords: ['欧元', 'euro', '金钱', '价格', '货币'],
    icon: LucideIcons.Euro,
  },
  PoundSterling: {
    name: '英镑',
    englishName: 'Pound Sterling',
    category: '购物商务',
    keywords: ['英镑', 'pound', 'sterling', '金钱', '货币'],
    icon: LucideIcons.PoundSterling,
  },
  Tag: {
    name: '标签',
    englishName: 'Tag',
    category: '购物商务',
    keywords: ['标签', 'tag', '价格', '分类', '标记'],
    icon: LucideIcons.Tag,
  },
  Tags: {
    name: '多标签',
    englishName: 'Tags',
    category: '购物商务',
    keywords: ['多标签', 'tags', '分类', '标记'],
    icon: LucideIcons.Tags,
  },
  Gift: {
    name: '礼物',
    englishName: 'Gift',
    category: '购物商务',
    keywords: ['礼物', 'gift', '奖励', '赠品', '礼品'],
    icon: LucideIcons.Gift,
  },
  Package: {
    name: '包裹',
    englishName: 'Package',
    category: '购物商务',
    keywords: ['包裹', 'package', '快递', '包装', '盒子'],
    icon: LucideIcons.Package,
  },
  Package2: {
    name: '包裹2',
    englishName: 'Package 2',
    category: '购物商务',
    keywords: ['包裹', 'package', '快递', '包装'],
    icon: LucideIcons.Package2,
  },
  PackageCheck: {
    name: '包裹确认',
    englishName: 'Package Check',
    category: '购物商务',
    keywords: ['包裹确认', 'package', 'check', '已送达'],
    icon: LucideIcons.PackageCheck,
  },
  PackageX: {
    name: '包裹拒收',
    englishName: 'Package X',
    category: '购物商务',
    keywords: ['包裹拒收', 'package', 'x', '拒绝'],
    icon: LucideIcons.PackageX,
  },
  Receipt: {
    name: '收据',
    englishName: 'Receipt',
    category: '购物商务',
    keywords: ['收据', 'receipt', '发票', '账单'],
    icon: LucideIcons.Receipt,
  },
  Wallet: {
    name: '钱包',
    englishName: 'Wallet',
    category: '购物商务',
    keywords: ['钱包', 'wallet', '支付', '金钱'],
    icon: LucideIcons.Wallet,
  },

  // 天气 Weather
  Sun: {
    name: '太阳',
    englishName: 'Sun',
    category: '天气',
    keywords: ['太阳', 'sun', '晴天', '明亮', '阳光'],
    icon: LucideIcons.Sun,
  },
  Moon: {
    name: '月亮',
    englishName: 'Moon',
    category: '天气',
    keywords: ['月亮', 'moon', '夜晚', '黑暗', '夜间'],
    icon: LucideIcons.Moon,
  },
  Cloud: {
    name: '云',
    englishName: 'Cloud',
    category: '天气',
    keywords: ['云', 'cloud', '天气', '阴天', '云朵'],
    icon: LucideIcons.Cloud,
  },
  CloudRain: {
    name: '下雨',
    englishName: 'Cloud Rain',
    category: '天气',
    keywords: ['下雨', 'cloud', 'rain', '雨天', '降雨'],
    icon: LucideIcons.CloudRain,
  },
  CloudSnow: {
    name: '下雪',
    englishName: 'Cloud Snow',
    category: '天气',
    keywords: ['下雪', 'cloud', 'snow', '雪天', '降雪'],
    icon: LucideIcons.CloudSnow,
  },
  CloudDrizzle: {
    name: '毛毛雨',
    englishName: 'Cloud Drizzle',
    category: '天气',
    keywords: ['毛毛雨', 'cloud', 'drizzle', '小雨'],
    icon: LucideIcons.CloudDrizzle,
  },
  CloudLightning: {
    name: '雷电',
    englishName: 'Cloud Lightning',
    category: '天气',
    keywords: ['雷电', 'cloud', 'lightning', '雷雨'],
    icon: LucideIcons.CloudLightning,
  },
  Zap: {
    name: '闪电',
    englishName: 'Lightning',
    category: '天气',
    keywords: ['闪电', 'lightning', '电', '能量', '雷'],
    icon: LucideIcons.Zap,
  },
  Snowflake: {
    name: '雪花',
    englishName: 'Snowflake',
    category: '天气',
    keywords: ['雪花', 'snowflake', '雪', '冬天'],
    icon: LucideIcons.Snowflake,
  },
  Sunrise: {
    name: '日出',
    englishName: 'Sunrise',
    category: '天气',
    keywords: ['日出', 'sunrise', '早晨', '黎明'],
    icon: LucideIcons.Sunrise,
  },
  Sunset: {
    name: '日落',
    englishName: 'Sunset',
    category: '天气',
    keywords: ['日落', 'sunset', '黄昏', '傍晚'],
    icon: LucideIcons.Sunset,
  },
  Wind: {
    name: '风',
    englishName: 'Wind',
    category: '天气',
    keywords: ['风', 'wind', '微风', '气流'],
    icon: LucideIcons.Wind,
  },
  Thermometer: {
    name: '温度计',
    englishName: 'Thermometer',
    category: '天气',
    keywords: ['温度计', 'thermometer', '温度', '气温'],
    icon: LucideIcons.Thermometer,
  },

  // 交通 Transportation
  Car: {
    name: '汽车',
    englishName: 'Car',
    category: '交通',
    keywords: ['汽车', 'car', '车辆', '交通', '轿车'],
    icon: LucideIcons.Car,
  },
  Truck: {
    name: '卡车',
    englishName: 'Truck',
    category: '交通',
    keywords: ['卡车', 'truck', '货车', '运输'],
    icon: LucideIcons.Truck,
  },
  Plane: {
    name: '飞机',
    englishName: 'Plane',
    category: '交通',
    keywords: ['飞机', 'plane', '航班', '旅行', '航空'],
    icon: LucideIcons.Plane,
  },
  Train: {
    name: '火车',
    englishName: 'Train',
    category: '交通',
    keywords: ['火车', 'train', '铁路', '运输', '地铁'],
    icon: LucideIcons.Train,
  },
  Ship: {
    name: '轮船',
    englishName: 'Ship',
    category: '交通',
    keywords: ['轮船', 'ship', '船只', '海运', '航海'],
    icon: LucideIcons.Ship,
  },
  Bike: {
    name: '自行车',
    englishName: 'Bike',
    category: '交通',
    keywords: ['自行车', 'bike', '骑行', '运动', '单车'],
    icon: LucideIcons.Bike,
  },
  Bus: {
    name: '公交车',
    englishName: 'Bus',
    category: '交通',
    keywords: ['公交车', 'bus', '巴士', '公共交通'],
    icon: LucideIcons.Bus,
  },
  Fuel: {
    name: '燃料',
    englishName: 'Fuel',
    category: '交通',
    keywords: ['燃料', 'fuel', '汽油', '加油'],
    icon: LucideIcons.Fuel,
  },
  ParkingCircle: {
    name: '停车',
    englishName: 'Parking',
    category: '交通',
    keywords: ['停车', 'parking', '停车场', '泊车'],
    icon: LucideIcons.ParkingCircle,
  },
  Route: {
    name: '路线',
    englishName: 'Route',
    category: '交通',
    keywords: ['路线', 'route', '道路', '路径'],
    icon: LucideIcons.Route,
  },

  // 科技 Technology
  Smartphone: {
    name: '智能手机',
    englishName: 'Smartphone',
    category: '科技',
    keywords: ['智能手机', 'smartphone', '手机', '移动', '电话'],
    icon: LucideIcons.Smartphone,
  },
  Bot: {
    name: '机器人',
    englishName: 'Bot',
    category: '科技',
    keywords: ['机器人', 'Bot'],
    icon: LucideIcons.Bot,
  },
  Tablet: {
    name: '平板',
    englishName: 'Tablet',
    category: '科技',
    keywords: ['平板', 'tablet', 'iPad', '平板电脑'],
    icon: LucideIcons.Tablet,
  },
  Laptop: {
    name: '笔记本',
    englishName: 'Laptop',
    category: '科技',
    keywords: ['笔记本', 'laptop', '电脑', '计算机', '便携'],
    icon: LucideIcons.Laptop,
  },
  Monitor: {
    name: '显示器',
    englishName: 'Monitor',
    category: '科技',
    keywords: ['显示器', 'monitor', '屏幕', '电脑', '桌面'],
    icon: LucideIcons.Monitor,
  },
  Tv: {
    name: '电视',
    englishName: 'TV',
    category: '科技',
    keywords: ['电视', 'tv', '电视机', '显示屏'],
    icon: LucideIcons.Tv,
  },
  Camera: {
    name: '相机',
    englishName: 'Camera',
    category: '科技',
    keywords: ['相机', 'camera', '拍照', '摄影', '照相机'],
    icon: LucideIcons.Camera,
  },
  Headphones: {
    name: '耳机',
    englishName: 'Headphones',
    category: '科技',
    keywords: ['耳机', 'headphones', '音乐', '听', '音频'],
    icon: LucideIcons.Headphones,
  },
  Speaker: {
    name: '扬声器',
    englishName: 'Speaker',
    category: '科技',
    keywords: ['扬声器', 'speaker', '音响', '声音', '播放'],
    icon: LucideIcons.Speaker,
  },
  Keyboard: {
    name: '键盘',
    englishName: 'Keyboard',
    category: '科技',
    keywords: ['键盘', 'keyboard', '输入', '打字'],
    icon: LucideIcons.Keyboard,
  },
  Mouse: {
    name: '鼠标',
    englishName: 'Mouse',
    category: '科技',
    keywords: ['鼠标', 'mouse', '点击', '指针'],
    icon: LucideIcons.Mouse,
  },
  Gamepad2: {
    name: '游戏手柄',
    englishName: 'Gamepad',
    category: '科技',
    keywords: ['游戏手柄', 'gamepad', '游戏', '娱乐', '控制器'],
    icon: LucideIcons.Gamepad2,
  },
  Joystick: {
    name: '摇杆',
    englishName: 'Joystick',
    category: '科技',
    keywords: ['摇杆', 'joystick', '游戏', '控制'],
    icon: LucideIcons.Joystick,
  },
  Usb: {
    name: 'USB',
    englishName: 'USB',
    category: '科技',
    keywords: ['USB', '接口', '连接', '数据线'],
    icon: LucideIcons.Usb,
  },
  MemoryStick: {
    name: '内存条',
    englishName: 'Memory Stick',
    category: '科技',
    keywords: ['内存条', 'memory', 'RAM', '存储'],
    icon: LucideIcons.MemoryStick,
  },
  Cpu: {
    name: '处理器',
    englishName: 'CPU',
    category: '科技',
    keywords: ['处理器', 'CPU', '芯片', '计算'],
    icon: LucideIcons.Cpu,
  },

  // 数据库开发 Database & Development
  Database: {
    name: '数据库',
    englishName: 'Database',
    category: '数据库开发',
    keywords: ['数据库', 'database', '数据', '存储', 'DB'],
    icon: LucideIcons.Database,
  },
  Server: {
    name: '服务器',
    englishName: 'Server',
    category: '数据库开发',
    keywords: ['服务器', 'server', '主机', '云', '后端'],
    icon: LucideIcons.Server,
  },
  Code: {
    name: '代码',
    englishName: 'Code',
    category: '数据库开发',
    keywords: ['代码', 'code', '编程', '开发', '程序'],
    icon: LucideIcons.Code,
  },
  Code2: {
    name: '代码2',
    englishName: 'Code 2',
    category: '数据库开发',
    keywords: ['代码', 'code', '编程', '标签'],
    icon: LucideIcons.Code2,
  },
  Terminal: {
    name: '终端',
    englishName: 'Terminal',
    category: '数据库开发',
    keywords: ['终端', 'terminal', '命令行', '控制台', 'CLI'],
    icon: LucideIcons.Terminal,
  },
  Bug: {
    name: '错误',
    englishName: 'Bug',
    category: '数据库开发',
    keywords: ['错误', 'bug', '问题', '调试', '虫子'],
    icon: LucideIcons.Bug,
  },
  GitBranch: {
    name: 'Git分支',
    englishName: 'Git Branch',
    category: '数据库开发',
    keywords: ['git', 'branch', '分支', '版本', '代码'],
    icon: LucideIcons.GitBranch,
  },
  GitCommit: {
    name: 'Git提交',
    englishName: 'Git Commit',
    category: '数据库开发',
    keywords: ['git', 'commit', '提交', '版本'],
    icon: LucideIcons.GitCommit,
  },
  GitMerge: {
    name: 'Git合并',
    englishName: 'Git Merge',
    category: '数据库开发',
    keywords: ['git', 'merge', '合并', '分支'],
    icon: LucideIcons.GitMerge,
  },
  GitPullRequest: {
    name: '拉取请求',
    englishName: 'Pull Request',
    category: '数据库开发',
    keywords: ['pull request', 'PR', '合并请求'],
    icon: LucideIcons.GitPullRequest,
  },
  Github: {
    name: 'GitHub',
    englishName: 'GitHub',
    category: '数据库开发',
    keywords: ['github', '代码', '仓库', '版本控制'],
    icon: LucideIcons.Github,
  },
  Gitlab: {
    name: 'GitLab',
    englishName: 'GitLab',
    category: '数据库开发',
    keywords: ['gitlab', '代码', '仓库'],
    icon: LucideIcons.Gitlab,
  },
  Component: {
    name: '组件',
    englishName: 'Component',
    category: '数据库开发',
    keywords: ['组件', 'component', '模块', '部件'],
    icon: LucideIcons.Component,
  },
  Layers: {
    name: '图层',
    englishName: 'Layers',
    category: '数据库开发',
    keywords: ['图层', 'layers', '层级', '堆叠'],
    icon: LucideIcons.Layers,
  },
  Puzzle: {
    name: '拼图',
    englishName: 'Puzzle',
    category: '数据库开发',
    keywords: ['拼图', 'puzzle', '插件', '扩展'],
    icon: LucideIcons.Puzzle,
  },
  Workflow: {
    name: '工作流',
    englishName: 'Workflow',
    category: '数据库开发',
    keywords: ['工作流', 'workflow', '流程', '自动化'],
    icon: LucideIcons.Workflow,
  },

  // 图表分析 Charts & Analytics
  BarChart: {
    name: '柱状图',
    englishName: 'Bar Chart',
    category: '图表分析',
    keywords: ['柱状图', 'bar', 'chart', '统计', '数据'],
    icon: LucideIcons.BarChart,
  },
  BarChart2: {
    name: '柱状图2',
    englishName: 'Bar Chart 2',
    category: '图表分析',
    keywords: ['柱状图', 'bar', 'chart', '统计'],
    icon: LucideIcons.BarChart2,
  },
  BarChart3: {
    name: '柱状图3',
    englishName: 'Bar Chart 3',
    category: '图表分析',
    keywords: ['柱状图', 'bar', 'chart', '统计'],
    icon: LucideIcons.BarChart3,
  },
  LineChart: {
    name: '折线图',
    englishName: 'Line Chart',
    category: '图表分析',
    keywords: ['折线图', 'line', 'chart', '趋势', '数据'],
    icon: LucideIcons.LineChart,
  },
  PieChart: {
    name: '饼图',
    englishName: 'Pie Chart',
    category: '图表分析',
    keywords: ['饼图', 'pie', 'chart', '比例', '数据'],
    icon: LucideIcons.PieChart,
  },
  TrendingUp: {
    name: '上升趋势',
    englishName: 'Trending Up',
    category: '图表分析',
    keywords: ['上升', 'trending', 'up', '增长', '涨'],
    icon: LucideIcons.TrendingUp,
  },
  TrendingDown: {
    name: '下降趋势',
    englishName: 'Trending Down',
    category: '图表分析',
    keywords: ['下降', 'trending', 'down', '减少', '跌'],
    icon: LucideIcons.TrendingDown,
  },
  Activity: {
    name: '活动',
    englishName: 'Activity',
    category: '图表分析',
    keywords: ['活动', 'activity', '动态', '监控', '心跳'],
    icon: LucideIcons.Activity,
  },
  AreaChart: {
    name: '面积图',
    englishName: 'Area Chart',
    category: '图表分析',
    keywords: ['面积图', 'area', 'chart', '数据'],
    icon: LucideIcons.AreaChart,
  },
  Gauge: {
    name: '仪表盘',
    englishName: 'Gauge',
    category: '图表分析',
    keywords: ['仪表盘', 'gauge', '测量', '指标'],
    icon: LucideIcons.Gauge,
  },
  Target: {
    name: '目标',
    englishName: 'Target',
    category: '图表分析',
    keywords: ['目标', 'target', '瞄准', '焦点', 'KPI'],
    icon: LucideIcons.Target,
  },
  Crosshair: {
    name: '十字线',
    englishName: 'Crosshair',
    category: '图表分析',
    keywords: ['十字线', 'crosshair', '瞄准', '定位'],
    icon: LucideIcons.Crosshair,
  },

  // 时间日历 Time & Calendar
  Calendar: {
    name: '日历',
    englishName: 'Calendar',
    category: '时间日历',
    keywords: ['日历', 'calendar', '日期', '时间', '日程'],
    icon: LucideIcons.Calendar,
  },
  CalendarDays: {
    name: '日历天数',
    englishName: 'Calendar Days',
    category: '时间日历',
    keywords: ['日历', 'calendar', 'days', '日期'],
    icon: LucideIcons.CalendarDays,
  },
  CalendarCheck: {
    name: '日历确认',
    englishName: 'Calendar Check',
    category: '时间日历',
    keywords: ['日历确认', 'calendar', 'check', '完成'],
    icon: LucideIcons.CalendarCheck,
  },
  CalendarX: {
    name: '日历取消',
    englishName: 'Calendar X',
    category: '时间日历',
    keywords: ['日历取消', 'calendar', 'x', '取消'],
    icon: LucideIcons.CalendarX,
  },
  CalendarPlus: {
    name: '添加日程',
    englishName: 'Calendar Plus',
    category: '时间日历',
    keywords: ['添加日程', 'calendar', 'plus', '新增'],
    icon: LucideIcons.CalendarPlus,
  },
  Clock: {
    name: '时钟',
    englishName: 'Clock',
    category: '时间日历',
    keywords: ['时钟', 'clock', '时间', '定时', '钟表'],
    icon: LucideIcons.Clock,
  },
  Clock3: {
    name: '时钟3点',
    englishName: 'Clock 3',
    category: '时间日历',
    keywords: ['时钟', 'clock', '3点', '时间'],
    icon: LucideIcons.Clock3,
  },
  Clock9: {
    name: '时钟9点',
    englishName: 'Clock 9',
    category: '时间日历',
    keywords: ['时钟', 'clock', '9点', '时间'],
    icon: LucideIcons.Clock9,
  },
  Timer: {
    name: '计时器',
    englishName: 'Timer',
    category: '时间日历',
    keywords: ['计时器', 'timer', '倒计时', '时间', '定时'],
    icon: LucideIcons.Timer,
  },
  TimerReset: {
    name: '重置计时器',
    englishName: 'Timer Reset',
    category: '时间日历',
    keywords: ['重置计时器', 'timer', 'reset', '重置'],
    icon: LucideIcons.TimerReset,
  },
  AlarmClock: {
    name: '闹钟',
    englishName: 'Alarm Clock',
    category: '时间日历',
    keywords: ['闹钟', 'alarm', 'clock', '提醒'],
    icon: LucideIcons.AlarmClock,
  },
  Watch: {
    name: '手表',
    englishName: 'Watch',
    category: '时间日历',
    keywords: ['手表', 'watch', '时间', '计时', '腕表'],
    icon: LucideIcons.Watch,
  },
  Hourglass: {
    name: '沙漏',
    englishName: 'Hourglass',
    category: '时间日历',
    keywords: ['沙漏', 'hourglass', '时间', '等待'],
    icon: LucideIcons.Hourglass,
  },

  // 社交反馈 Social & Feedback
  Heart: {
    name: '心形',
    englishName: 'Heart',
    category: '社交反馈',
    keywords: ['心形', 'heart', '喜欢', '爱', '收藏'],
    icon: LucideIcons.Heart,
  },
  HeartHandshake: {
    name: '爱心握手',
    englishName: 'Heart Handshake',
    category: '社交反馈',
    keywords: ['爱心握手', 'heart', 'handshake', '友好'],
    icon: LucideIcons.HeartHandshake,
  },
  Star: {
    name: '星星',
    englishName: 'Star',
    category: '社交反馈',
    keywords: ['星星', 'star', '收藏', '评分', '喜欢'],
    icon: LucideIcons.Star,
  },
  StarHalf: {
    name: '半星',
    englishName: 'Star Half',
    category: '社交反馈',
    keywords: ['半星', 'star', 'half', '评分'],
    icon: LucideIcons.StarHalf,
  },
  ThumbsUp: {
    name: '点赞',
    englishName: 'Thumbs Up',
    category: '社交反馈',
    keywords: ['点赞', 'thumbs', 'up', '好评', '赞'],
    icon: LucideIcons.ThumbsUp,
  },
  ThumbsDown: {
    name: '点踩',
    englishName: 'Thumbs Down',
    category: '社交反馈',
    keywords: ['点踩', 'thumbs', 'down', '差评', '踩'],
    icon: LucideIcons.ThumbsDown,
  },
  Bell: {
    name: '铃铛',
    englishName: 'Bell',
    category: '社交反馈',
    keywords: ['铃铛', 'bell', '通知', '提醒', '消息'],
    icon: LucideIcons.Bell,
  },
  BellOff: {
    name: '关闭通知',
    englishName: 'Bell Off',
    category: '社交反馈',
    keywords: ['关闭通知', 'bell', 'off', '静音', '免打扰'],
    icon: LucideIcons.BellOff,
  },
  BellRing: {
    name: '响铃',
    englishName: 'Bell Ring',
    category: '社交反馈',
    keywords: ['响铃', 'bell', 'ring', '提醒'],
    icon: LucideIcons.BellRing,
  },
  Share2: {
    name: '分享2',
    englishName: 'Share 2',
    category: '社交反馈',
    keywords: ['分享', 'share', '转发'],
    icon: LucideIcons.Share2,
  },
  Forward: {
    name: '转发',
    englishName: 'Forward',
    category: '社交反馈',
    keywords: ['转发', 'forward', '分享', '传递'],
    icon: LucideIcons.Forward,
  },
  Reply: {
    name: '回复',
    englishName: 'Reply',
    category: '社交反馈',
    keywords: ['回复', 'reply', '回答', '响应'],
    icon: LucideIcons.Reply,
  },
  ReplyAll: {
    name: '全部回复',
    englishName: 'Reply All',
    category: '社交反馈',
    keywords: ['全部回复', 'reply', 'all', '群回'],
    icon: LucideIcons.ReplyAll,
  },

  // 工具 Tools & Utilities
  Hammer: {
    name: '锤子',
    englishName: 'Hammer',
    category: '工具',
    keywords: ['锤子', 'hammer', '工具', '建造', '修理'],
    icon: LucideIcons.Hammer,
  },
  Scissors: {
    name: '剪刀',
    englishName: 'Scissors',
    category: '工具',
    keywords: ['剪刀', 'scissors', '剪切', '工具', '裁剪'],
    icon: LucideIcons.Scissors,
  },
  Paperclip: {
    name: '回形针',
    englishName: 'Paperclip',
    category: '工具',
    keywords: ['回形针', 'paperclip', '附件', '连接', '夹子'],
    icon: LucideIcons.Paperclip,
  },
  Pin: {
    name: '图钉',
    englishName: 'Pin',
    category: '工具',
    keywords: ['图钉', 'pin', '固定', '标记', '钉子'],
    icon: LucideIcons.Pin,
  },
  PinOff: {
    name: '取消固定',
    englishName: 'Pin Off',
    category: '工具',
    keywords: ['取消固定', 'pin', 'off', '取消'],
    icon: LucideIcons.PinOff,
  },
  Bookmark: {
    name: '书签',
    englishName: 'Bookmark',
    category: '工具',
    keywords: ['书签', 'bookmark', '收藏', '标记', '保存'],
    icon: LucideIcons.Bookmark,
  },
  BookmarkPlus: {
    name: '添加书签',
    englishName: 'Bookmark Plus',
    category: '工具',
    keywords: ['添加书签', 'bookmark', 'plus', '收藏'],
    icon: LucideIcons.BookmarkPlus,
  },
  BookmarkMinus: {
    name: '删除书签',
    englishName: 'Bookmark Minus',
    category: '工具',
    keywords: ['删除书签', 'bookmark', 'minus', '移除'],
    icon: LucideIcons.BookmarkMinus,
  },
  Ruler: {
    name: '尺子',
    englishName: 'Ruler',
    category: '工具',
    keywords: ['尺子', 'ruler', '测量', '工具'],
    icon: LucideIcons.Ruler,
  },
  Pipette: {
    name: '吸管',
    englishName: 'Color Picker',
    category: '工具',
    keywords: ['吸管', 'pipette', '颜色选择', '取色'],
    icon: LucideIcons.Pipette,
  },
  Paintbrush: {
    name: '画笔',
    englishName: 'Paintbrush',
    category: '工具',
    keywords: ['画笔', 'paintbrush', '绘画', '设计', '刷子'],
    icon: LucideIcons.Paintbrush,
  },
  Palette: {
    name: '调色板',
    englishName: 'Palette',
    category: '工具',
    keywords: ['调色板', 'palette', '颜色', '设计', '画板'],
    icon: LucideIcons.Palette,
  },
  Eraser: {
    name: '橡皮擦',
    englishName: 'Eraser',
    category: '工具',
    keywords: ['橡皮擦', 'eraser', '擦除', '删除'],
    icon: LucideIcons.Eraser,
  },
  Pen: {
    name: '钢笔',
    englishName: 'Pen',
    category: '工具',
    keywords: ['钢笔', 'pen', '写字', '签名'],
    icon: LucideIcons.Pen,
  },
  PenTool: {
    name: '钢笔工具',
    englishName: 'Pen Tool',
    category: '工具',
    keywords: ['钢笔工具', 'pen', 'tool', '设计'],
    icon: LucideIcons.PenTool,
  },
  Pencil: {
    name: '铅笔',
    englishName: 'Pencil',
    category: '工具',
    keywords: ['铅笔', 'pencil', '写字', '绘画'],
    icon: LucideIcons.Pencil,
  },
  Highlighter: {
    name: '荧光笔',
    englishName: 'Highlighter',
    category: '工具',
    keywords: ['荧光笔', 'highlighter', '标记', '高亮'],
    icon: LucideIcons.Highlighter,
  },

  // 健康医疗 Health & Medical
  Pill: {
    name: '药丸',
    englishName: 'Pill',
    category: '健康医疗',
    keywords: ['药丸', 'pill', '药物', '医疗', '治疗'],
    icon: LucideIcons.Pill,
  },
  Stethoscope: {
    name: '听诊器',
    englishName: 'Stethoscope',
    category: '健康医疗',
    keywords: ['听诊器', 'stethoscope', '医生', '检查'],
    icon: LucideIcons.Stethoscope,
  },
  Syringe: {
    name: '注射器',
    englishName: 'Syringe',
    category: '健康医疗',
    keywords: ['注射器', 'syringe', '疫苗', '注射'],
    icon: LucideIcons.Syringe,
  },
  Bandage: {
    name: '绷带',
    englishName: 'Bandage',
    category: '健康医疗',
    keywords: ['绷带', 'bandage', '包扎', '伤口'],
    icon: LucideIcons.Bandage,
  },
  Cross: {
    name: '十字',
    englishName: 'Cross',
    category: '健康医疗',
    keywords: ['十字', 'cross', '医疗', '急救'],
    icon: LucideIcons.Cross,
  },
  Hospital: {
    name: '医院',
    englishName: 'Hospital',
    category: '健康医疗',
    keywords: ['医院', 'hospital', '医疗', '治疗'],
    icon: LucideIcons.Hospital,
  },
  Ambulance: {
    name: '救护车',
    englishName: 'Ambulance',
    category: '健康医疗',
    keywords: ['救护车', 'ambulance', '急救', '医疗'],
    icon: LucideIcons.Ambulance,
  },
  HeartPulse: {
    name: '心跳',
    englishName: 'Heart Pulse',
    category: '健康医疗',
    keywords: ['心跳', 'heart', 'pulse', '脉搏'],
    icon: LucideIcons.HeartPulse,
  },
  Brain: {
    name: '大脑',
    englishName: 'Brain',
    category: '健康医疗',
    keywords: ['大脑', 'brain', '思维', '智力'],
    icon: LucideIcons.Brain,
  },
  Dna: {
    name: 'DNA',
    englishName: 'DNA',
    category: '健康医疗',
    keywords: ['DNA', '基因', '遗传', '生物'],
    icon: LucideIcons.Dna,
  },

  // 教育 Education
  BookOpen: {
    name: '打开的书',
    englishName: 'Book Open',
    category: '教育',
    keywords: ['书', 'book', 'open', '阅读', '学习'],
    icon: LucideIcons.BookOpen,
  },
  Book: {
    name: '书',
    englishName: 'Book',
    category: '教育',
    keywords: ['书', 'book', '学习', '教育', '知识'],
    icon: LucideIcons.Book,
  },
  GraduationCap: {
    name: '学士帽',
    englishName: 'Graduation Cap',
    category: '教育',
    keywords: ['学士帽', 'graduation', 'cap', '毕业', '学位'],
    icon: LucideIcons.GraduationCap,
  },
  School: {
    name: '学校',
    englishName: 'School',
    category: '教育',
    keywords: ['学校', 'school', '教育', '学习'],
    icon: LucideIcons.School,
  },
  Library: {
    name: '图书馆',
    englishName: 'Library',
    category: '教育',
    keywords: ['图书馆', 'library', '书籍', '学习'],
    icon: LucideIcons.Library,
  },
  Notebook: {
    name: '笔记本',
    englishName: 'Notebook',
    category: '教育',
    keywords: ['笔记本', 'notebook', '记录', '学习'],
    icon: LucideIcons.Notebook,
  },
  NotebookPen: {
    name: '笔记本和笔',
    englishName: 'Notebook Pen',
    category: '教育',
    keywords: ['笔记本', 'notebook', 'pen', '写字'],
    icon: LucideIcons.NotebookPen,
  },
  Calculator: {
    name: '计算器',
    englishName: 'Calculator',
    category: '教育',
    keywords: ['计算器', 'calculator', '数学', '计算'],
    icon: LucideIcons.Calculator,
  },
  Microscope: {
    name: '显微镜',
    englishName: 'Microscope',
    category: '教育',
    keywords: ['显微镜', 'microscope', '科学', '研究'],
    icon: LucideIcons.Microscope,
  },
  FlaskConical: {
    name: '锥形瓶',
    englishName: 'Flask Conical',
    category: '教育',
    keywords: ['锥形瓶', 'flask', '化学', '实验'],
    icon: LucideIcons.FlaskConical,
  },
  TestTube: {
    name: '试管',
    englishName: 'Test Tube',
    category: '教育',
    keywords: ['试管', 'test tube', '化学', '实验'],
    icon: LucideIcons.TestTube,
  },
  Atom: {
    name: '原子',
    englishName: 'Atom',
    category: '教育',
    keywords: ['原子', 'atom', '物理', '科学'],
    icon: LucideIcons.Atom,
  },
  Globe: {
    name: '地球仪',
    englishName: 'Globe',
    category: '教育',
    keywords: ['地球仪', 'globe', '地理', '世界'],
    icon: LucideIcons.Globe,
  },

  // 运动娱乐 Sports & Recreation
  Trophy: {
    name: '奖杯',
    englishName: 'Trophy',
    category: '运动娱乐',
    keywords: ['奖杯', 'trophy', '奖励', '胜利', '冠军'],
    icon: LucideIcons.Trophy,
  },
  Medal: {
    name: '奖牌',
    englishName: 'Medal',
    category: '运动娱乐',
    keywords: ['奖牌', 'medal', '奖励', '荣誉'],
    icon: LucideIcons.Medal,
  },
  Award: {
    name: '奖励',
    englishName: 'Award',
    category: '运动娱乐',
    keywords: ['奖励', 'award', '荣誉', '成就', '表彰'],
    icon: LucideIcons.Award,
  },
  Dumbbell: {
    name: '哑铃',
    englishName: 'Dumbbell',
    category: '运动娱乐',
    keywords: ['哑铃', 'dumbbell', '健身', '运动'],
    icon: LucideIcons.Dumbbell,
  },
  Volleyball: {
    name: '排球',
    englishName: 'Volleyball',
    category: '运动娱乐',
    keywords: ['排球', 'volleyball', '运动', '球类'],
    icon: LucideIcons.Volleyball,
  },
  Waves: {
    name: '波浪',
    englishName: 'Waves',
    category: '运动娱乐',
    keywords: ['波浪', 'waves', '冲浪', '海洋'],
    icon: LucideIcons.Waves,
  },
  Mountain: {
    name: '山',
    englishName: 'Mountain',
    category: '运动娱乐',
    keywords: ['山', 'mountain', '登山', '户外'],
    icon: LucideIcons.Mountain,
  },
  TreePine: {
    name: '松树',
    englishName: 'Pine Tree',
    category: '运动娱乐',
    keywords: ['松树', 'pine', 'tree', '户外'],
    icon: LucideIcons.TreePine,
  },
  Tent: {
    name: '帐篷',
    englishName: 'Tent',
    category: '运动娱乐',
    keywords: ['帐篷', 'tent', '露营', '户外'],
    icon: LucideIcons.Tent,
  },
  Campfire: {
    name: '篝火',
    englishName: 'Campfire',
    category: '运动娱乐',
    keywords: ['篝火', 'campfire', '露营', '火'],
    icon: LucideIcons.Flame,
  },

  // 食物餐饮 Food & Dining
  Coffee: {
    name: '咖啡',
    englishName: 'Coffee',
    category: '食物餐饮',
    keywords: ['咖啡', 'coffee', '饮料', '休息', '提神'],
    icon: LucideIcons.Coffee,
  },
  Pizza: {
    name: '披萨',
    englishName: 'Pizza',
    category: '食物餐饮',
    keywords: ['披萨', 'pizza', '食物', '意大利'],
    icon: LucideIcons.Pizza,
  },
  Apple: {
    name: '苹果',
    englishName: 'Apple',
    category: '食物餐饮',
    keywords: ['苹果', 'apple', '水果', '健康'],
    icon: LucideIcons.Apple,
  },
  Cherry: {
    name: '樱桃',
    englishName: 'Cherry',
    category: '食物餐饮',
    keywords: ['樱桃', 'cherry', '水果', '甜'],
    icon: LucideIcons.Cherry,
  },
  Grape: {
    name: '葡萄',
    englishName: 'Grape',
    category: '食物餐饮',
    keywords: ['葡萄', 'grape', '水果', '酒'],
    icon: LucideIcons.Grape,
  },
  Banana: {
    name: '香蕉',
    englishName: 'Banana',
    category: '食物餐饮',
    keywords: ['香蕉', 'banana', '水果', '黄色'],
    icon: LucideIcons.Banana,
  },
  UtensilsCrossed: {
    name: '餐具',
    englishName: 'Utensils',
    category: '食物餐饮',
    keywords: ['餐具', 'utensils', '吃饭', '用餐', '刀叉'],
    icon: LucideIcons.UtensilsCrossed,
  },
  ChefHat: {
    name: '厨师帽',
    englishName: 'Chef Hat',
    category: '食物餐饮',
    keywords: ['厨师帽', 'chef', 'hat', '烹饪'],
    icon: LucideIcons.ChefHat,
  },
  CookingPot: {
    name: '锅',
    englishName: 'Cooking Pot',
    category: '食物餐饮',
    keywords: ['锅', 'cooking', 'pot', '烹饪'],
    icon: LucideIcons.CookingPot,
  },
  Soup: {
    name: '汤',
    englishName: 'Soup',
    category: '食物餐饮',
    keywords: ['汤', 'soup', '食物', '热'],
    icon: LucideIcons.Soup,
  },
  IceCream: {
    name: '冰淇淋',
    englishName: 'Ice Cream',
    category: '食物餐饮',
    keywords: ['冰淇淋', 'ice cream', '甜品', '冷'],
    icon: LucideIcons.IceCream,
  },
  Cake: {
    name: '蛋糕',
    englishName: 'Cake',
    category: '食物餐饮',
    keywords: ['蛋糕', 'cake', '甜品', '生日'],
    icon: LucideIcons.Cake,
  },
  Wine: {
    name: '红酒',
    englishName: 'Wine',
    category: '食物餐饮',
    keywords: ['红酒', 'wine', '酒', '饮料'],
    icon: LucideIcons.Wine,
  },
  Beer: {
    name: '啤酒',
    englishName: 'Beer',
    category: '食物餐饮',
    keywords: ['啤酒', 'beer', '酒', '饮料'],
    icon: LucideIcons.Beer,
  },
  Milk: {
    name: '牛奶',
    englishName: 'Milk',
    category: '食物餐饮',
    keywords: ['牛奶', 'milk', '饮料', '营养'],
    icon: LucideIcons.Milk,
  },

  // 动物自然 Animals & Nature
  Dog: {
    name: '狗',
    englishName: 'Dog',
    category: '动物自然',
    keywords: ['狗', 'dog', '宠物', '动物'],
    icon: LucideIcons.Dog,
  },
  Cat: {
    name: '猫',
    englishName: 'Cat',
    category: '动物自然',
    keywords: ['猫', 'cat', '宠物', '动物'],
    icon: LucideIcons.Cat,
  },
  Bird: {
    name: '鸟',
    englishName: 'Bird',
    category: '动物自然',
    keywords: ['鸟', 'bird', '动物', '飞行'],
    icon: LucideIcons.Bird,
  },
  Fish: {
    name: '鱼',
    englishName: 'Fish',
    category: '动物自然',
    keywords: ['鱼', 'fish', '动物', '海洋'],
    icon: LucideIcons.Fish,
  },
  Rabbit: {
    name: '兔子',
    englishName: 'Rabbit',
    category: '动物自然',
    keywords: ['兔子', 'rabbit', '动物', '可爱'],
    icon: LucideIcons.Rabbit,
  },
  Squirrel: {
    name: '松鼠',
    englishName: 'Squirrel',
    category: '动物自然',
    keywords: ['松鼠', 'squirrel', '动物', '坚果'],
    icon: LucideIcons.Squirrel,
  },
  Trees: {
    name: '树木',
    englishName: 'Trees',
    category: '动物自然',
    keywords: ['树木', 'trees', '森林', '自然'],
    icon: LucideIcons.Trees,
  },
  TreeDeciduous: {
    name: '树',
    englishName: 'Tree',
    category: '动物自然',
    keywords: ['树', 'tree', '植物', '自然'],
    icon: LucideIcons.TreeDeciduous,
  },
  Flower: {
    name: '花',
    englishName: 'Flower',
    category: '动物自然',
    keywords: ['花', 'flower', '植物', '美丽'],
    icon: LucideIcons.Flower,
  },
  Flower2: {
    name: '花朵',
    englishName: 'Flower 2',
    category: '动物自然',
    keywords: ['花朵', 'flower', '植物', '装饰'],
    icon: LucideIcons.Flower2,
  },
  Leaf: {
    name: '叶子',
    englishName: 'Leaf',
    category: '动物自然',
    keywords: ['叶子', 'leaf', '植物', '绿色'],
    icon: LucideIcons.Leaf,
  },
  Sprout: {
    name: '幼苗',
    englishName: 'Seedling',
    category: '动物自然',
    keywords: ['幼苗', 'seedling', '植物', '成长'],
    icon: LucideIcons.Sprout,
  },

  // 建筑地点 Buildings & Places
  Building: {
    name: '建筑',
    englishName: 'Building',
    category: '建筑地点',
    keywords: ['建筑', 'building', '大楼', '办公', '城市'],
    icon: LucideIcons.Building,
  },
  Building2: {
    name: '建筑2',
    englishName: 'Building 2',
    category: '建筑地点',
    keywords: ['建筑', 'building', '大楼', '商业'],
    icon: LucideIcons.Building2,
  },
  Store: {
    name: '商店',
    englishName: 'Store',
    category: '建筑地点',
    keywords: ['商店', 'store', '购物', '零售', '店铺'],
    icon: LucideIcons.Store,
  },
  Church: {
    name: '教堂',
    englishName: 'Church',
    category: '建筑地点',
    keywords: ['教堂', 'church', '宗教', '建筑'],
    icon: LucideIcons.Church,
  },
  Factory: {
    name: '工厂',
    englishName: 'Factory',
    category: '建筑地点',
    keywords: ['工厂', 'factory', '制造', '工业'],
    icon: LucideIcons.Factory,
  },
  Warehouse: {
    name: '仓库',
    englishName: 'Warehouse',
    category: '建筑地点',
    keywords: ['仓库', 'warehouse', '存储', '物流'],
    icon: LucideIcons.Warehouse,
  },
  MapPin: {
    name: '地图标记',
    englishName: 'Map Pin',
    category: '建筑地点',
    keywords: ['地图', 'map', 'pin', '位置', '定位'],
    icon: LucideIcons.MapPin,
  },
  Map: {
    name: '地图',
    englishName: 'Map',
    category: '建筑地点',
    keywords: ['地图', 'map', '导航', '位置', '路线'],
    icon: LucideIcons.Map,
  },
  Landmark: {
    name: '地标',
    englishName: 'Landmark',
    category: '建筑地点',
    keywords: ['地标', 'landmark', '建筑', '著名'],
    icon: LucideIcons.Landmark,
  },
  Castle: {
    name: '城堡',
    englishName: 'Castle',
    category: '建筑地点',
    keywords: ['城堡', 'castle', '建筑', '历史'],
    icon: LucideIcons.Castle,
  },

  // 形状符号 Symbols & Shapes
  Circle: {
    name: '圆形',
    englishName: 'Circle',
    category: '形状符号',
    keywords: ['圆形', 'circle', '形状', '几何'],
    icon: LucideIcons.Circle,
  },
  Triangle: {
    name: '三角形',
    englishName: 'Triangle',
    category: '形状符号',
    keywords: ['三角形', 'triangle', '形状', '几何'],
    icon: LucideIcons.Triangle,
  },
  Diamond: {
    name: '菱形',
    englishName: 'Diamond',
    category: '形状符号',
    keywords: ['菱形', 'diamond', '形状', '宝石'],
    icon: LucideIcons.Diamond,
  },
  Hexagon: {
    name: '六边形',
    englishName: 'Hexagon',
    category: '形状符号',
    keywords: ['六边形', 'hexagon', '形状', '几何'],
    icon: LucideIcons.Hexagon,
  },
  Pentagon: {
    name: '五边形',
    englishName: 'Pentagon',
    category: '形状符号',
    keywords: ['五边形', 'pentagon', '形状', '几何'],
    icon: LucideIcons.Pentagon,
  },
  Octagon: {
    name: '八边形',
    englishName: 'Octagon',
    category: '形状符号',
    keywords: ['八边形', 'octagon', '形状', '几何'],
    icon: LucideIcons.Octagon,
  },
  Infinity: {
    name: '无穷',
    englishName: 'Infinity',
    category: '形状符号',
    keywords: ['无穷', 'infinity', '符号', '数学'],
    icon: LucideIcons.Infinity,
  },
  Hash: {
    name: '井号',
    englishName: 'Hash',
    category: '形状符号',
    keywords: ['井号', 'hash', '符号', '标签'],
    icon: LucideIcons.Hash,
  },
  AtSign: {
    name: '@符号',
    englishName: 'At Sign',
    category: '形状符号',
    keywords: ['@符号', 'at', 'sign', '邮箱'],
    icon: LucideIcons.AtSign,
  },
  Percent: {
    name: '百分号',
    englishName: 'Percent',
    category: '形状符号',
    keywords: ['百分号', 'percent', '符号', '比例'],
    icon: LucideIcons.Percent,
  },
  Ampersand: {
    name: '&符号',
    englishName: 'Ampersand',
    category: '形状符号',
    keywords: ['&符号', 'ampersand', '符号', '和'],
    icon: LucideIcons.Ampersand,
  },

  // 布局设计 Layout & Design
  Layout: {
    name: '布局',
    englishName: 'Layout',
    category: '布局设计',
    keywords: ['布局', 'layout', '设计', '排版', '界面'],
    icon: LucideIcons.Layout,
  },
  LayoutDashboard: {
    name: '仪表板',
    englishName: 'Dashboard',
    category: '布局设计',
    keywords: ['仪表板', 'dashboard', '控制台', '面板', '管理'],
    icon: LucideIcons.LayoutDashboard,
  },
  LayoutGrid: {
    name: '网格布局',
    englishName: 'Layout Grid',
    category: '布局设计',
    keywords: ['网格', 'grid', 'layout', '布局', '排列'],
    icon: LucideIcons.LayoutGrid,
  },
  LayoutList: {
    name: '列表布局',
    englishName: 'Layout List',
    category: '布局设计',
    keywords: ['列表', 'list', 'layout', '布局'],
    icon: LucideIcons.LayoutList,
  },
  Columns: {
    name: '列',
    englishName: 'Columns',
    category: '布局设计',
    keywords: ['列', 'columns', '布局', '排列', '分栏'],
    icon: LucideIcons.Columns,
  },
  Rows: {
    name: '行',
    englishName: 'Rows',
    category: '布局设计',
    keywords: ['行', 'rows', '布局', '排列', '分行'],
    icon: LucideIcons.Rows,
  },
  SplitSquareHorizontal: {
    name: '水平分割',
    englishName: 'Split Horizontal',
    category: '布局设计',
    keywords: ['水平分割', 'split', 'horizontal', '布局'],
    icon: LucideIcons.SplitSquareHorizontal,
  },
  SplitSquareVertical: {
    name: '垂直分割',
    englishName: 'Split Vertical',
    category: '布局设计',
    keywords: ['垂直分割', 'split', 'vertical', '布局'],
    icon: LucideIcons.SplitSquareVertical,
  },
  Maximize: {
    name: '最大化',
    englishName: 'Maximize',
    category: '布局设计',
    keywords: ['最大化', 'maximize', '全屏', '展开'],
    icon: LucideIcons.Maximize,
  },
  Minimize: {
    name: '最小化',
    englishName: 'Minimize',
    category: '布局设计',
    keywords: ['最小化', 'minimize', '缩小', '收起'],
    icon: LucideIcons.Minimize,
  },
  Expand: {
    name: '展开',
    englishName: 'Expand',
    category: '布局设计',
    keywords: ['展开', 'expand', '放大', '扩展'],
    icon: LucideIcons.Expand,
  },
  Shrink: {
    name: '收缩',
    englishName: 'Shrink',
    category: '布局设计',
    keywords: ['收缩', 'shrink', '缩小', '压缩'],
    icon: LucideIcons.Shrink,
  },

  // 文字排版 Text & Typography
  Type: {
    name: '文字',
    englishName: 'Type',
    category: '文字排版',
    keywords: ['文字', 'type', '字体', '排版', '文本'],
    icon: LucideIcons.Type,
  },
  Bold: {
    name: '粗体',
    englishName: 'Bold',
    category: '文字排版',
    keywords: ['粗体', 'bold', '加粗', '字体', '强调'],
    icon: LucideIcons.Bold,
  },
  Italic: {
    name: '斜体',
    englishName: 'Italic',
    category: '文字排版',
    keywords: ['斜体', 'italic', '倾斜', '字体', '样式'],
    icon: LucideIcons.Italic,
  },
  Underline: {
    name: '下划线',
    englishName: 'Underline',
    category: '文字排版',
    keywords: ['下划线', 'underline', '字体', '装饰'],
    icon: LucideIcons.Underline,
  },
  Strikethrough: {
    name: '删除线',
    englishName: 'Strikethrough',
    category: '文字排版',
    keywords: ['删除线', 'strikethrough', '字体', '划掉'],
    icon: LucideIcons.Strikethrough,
  },
  AlignLeft: {
    name: '左对齐',
    englishName: 'Align Left',
    category: '文字排版',
    keywords: ['左对齐', 'align', 'left', '对齐', '排版'],
    icon: LucideIcons.AlignLeft,
  },
  AlignCenter: {
    name: '居中对齐',
    englishName: 'Align Center',
    category: '文字排版',
    keywords: ['居中', 'align', 'center', '对齐', '排版'],
    icon: LucideIcons.AlignCenter,
  },
  AlignRight: {
    name: '右对齐',
    englishName: 'Align Right',
    category: '文字排版',
    keywords: ['右对齐', 'align', 'right', '对齐', '排版'],
    icon: LucideIcons.AlignRight,
  },
  AlignJustify: {
    name: '两端对齐',
    englishName: 'Align Justify',
    category: '文字排版',
    keywords: ['两端对齐', 'align', 'justify', '对齐'],
    icon: LucideIcons.AlignJustify,
  },
  Indent: {
    name: '缩进',
    englishName: 'Indent',
    category: '文字排版',
    keywords: ['缩进', 'indent', '排版', '格式'],
    icon: LucideIcons.Indent,
  },
  Outdent: {
    name: '取消缩进',
    englishName: 'Outdent',
    category: '文字排版',
    keywords: ['取消缩进', 'outdent', '排版', '格式'],
    icon: LucideIcons.Outdent,
  },
  ListOrdered: {
    name: '有序列表',
    englishName: 'Ordered List',
    category: '文字排版',
    keywords: ['有序列表', 'ordered', 'list', '数字'],
    icon: LucideIcons.ListOrdered,
  },
  Quote: {
    name: '引用',
    englishName: 'Quote',
    category: '文字排版',
    keywords: ['引用', 'quote', '引号', '文本'],
    icon: LucideIcons.Quote,
  },
  Heading1: {
    name: '标题1',
    englishName: 'Heading 1',
    category: '文字排版',
    keywords: ['标题', 'heading', 'h1', '大标题'],
    icon: LucideIcons.Heading1,
  },
  Heading2: {
    name: '标题2',
    englishName: 'Heading 2',
    category: '文字排版',
    keywords: ['标题', 'heading', 'h2', '副标题'],
    icon: LucideIcons.Heading2,
  },
  Heading3: {
    name: '标题3',
    englishName: 'Heading 3',
    category: '文字排版',
    keywords: ['标题', 'heading', 'h3', '小标题'],
    icon: LucideIcons.Heading3,
  },

  // 颜色设计 Colors & Design
  Contrast: {
    name: '对比度',
    englishName: 'Contrast',
    category: '颜色设计',
    keywords: ['对比度', 'contrast', '颜色', '调节'],
    icon: LucideIcons.Contrast,
  },
  Droplet: {
    name: '水滴',
    englishName: 'Droplet',
    category: '颜色设计',
    keywords: ['水滴', 'droplet', '液体', '颜料'],
    icon: LucideIcons.Droplet,
  },
  Sparkles: {
    name: '闪光',
    englishName: 'Sparkles',
    category: '颜色设计',
    keywords: ['闪光', 'sparkles', '特效', '魔法', '装饰'],
    icon: LucideIcons.Sparkles,
  },
  Wand: {
    name: '魔法棒',
    englishName: 'Magic Wand',
    category: '颜色设计',
    keywords: ['魔法棒', 'wand', '魔法', '工具'],
    icon: LucideIcons.Wand,
  },
  Wand2: {
    name: '魔法棒2',
    englishName: 'Magic Wand 2',
    category: '颜色设计',
    keywords: ['魔法棒', 'wand', '魔法', '选择'],
    icon: LucideIcons.Wand2,
  },

  // 网络连接 Network & Connectivity
  Wifi: {
    name: 'WiFi',
    englishName: 'WiFi',
    category: '网络连接',
    keywords: ['wifi', '无线', '网络', '连接', '信号'],
    icon: LucideIcons.Wifi,
  },
  WifiOff: {
    name: 'WiFi断开',
    englishName: 'WiFi Off',
    category: '网络连接',
    keywords: ['wifi', 'off', '断开', '无网络', '离线'],
    icon: LucideIcons.WifiOff,
  },
  Bluetooth: {
    name: '蓝牙',
    englishName: 'Bluetooth',
    category: '网络连接',
    keywords: ['蓝牙', 'bluetooth', '无线', '连接'],
    icon: LucideIcons.Bluetooth,
  },
  BluetoothConnected: {
    name: '蓝牙已连接',
    englishName: 'Bluetooth Connected',
    category: '网络连接',
    keywords: ['蓝牙', 'bluetooth', 'connected', '已连接'],
    icon: LucideIcons.BluetoothConnected,
  },
  BluetoothOff: {
    name: '蓝牙关闭',
    englishName: 'Bluetooth Off',
    category: '网络连接',
    keywords: ['蓝牙', 'bluetooth', 'off', '关闭'],
    icon: LucideIcons.BluetoothOff,
  },
  Antenna: {
    name: '天线',
    englishName: 'Antenna',
    category: '网络连接',
    keywords: ['天线', 'antenna', '信号', '接收'],
    icon: LucideIcons.Antenna,
  },
  Rss: {
    name: 'RSS',
    englishName: 'RSS',
    category: '网络连接',
    keywords: ['RSS', '订阅', '信息流', '新闻'],
    icon: LucideIcons.Rss,
  },
  Globe2: {
    name: '地球',
    englishName: 'Globe 2',
    category: '网络连接',
    keywords: ['地球', 'globe', '世界', '网络'],
    icon: LucideIcons.Globe2,
  },
  Link2: {
    name: '链接2',
    englishName: 'Link 2',
    category: '网络连接',
    keywords: ['链接', 'link', '连接', '关联'],
    icon: LucideIcons.Link2,
  },
  Unlink2: {
    name: '断开链接2',
    englishName: 'Unlink 2',
    category: '网络连接',
    keywords: ['断开链接', 'unlink', '断开'],
    icon: LucideIcons.Unlink2,
  },
  Signal: {
    name: '信号',
    englishName: 'Signal',
    category: '网络连接',
    keywords: ['信号', 'signal', '强度', '网络'],
    icon: LucideIcons.Signal,
  },
  SignalHigh: {
    name: '强信号',
    englishName: 'Signal High',
    category: '网络连接',
    keywords: ['强信号', 'signal', 'high', '满格'],
    icon: LucideIcons.SignalHigh,
  },
  SignalLow: {
    name: '弱信号',
    englishName: 'Signal Low',
    category: '网络连接',
    keywords: ['弱信号', 'signal', 'low', '一格'],
    icon: LucideIcons.SignalLow,
  },
  SignalMedium: {
    name: '中等信号',
    englishName: 'Signal Medium',
    category: '网络连接',
    keywords: ['中等信号', 'signal', 'medium', '两格'],
    icon: LucideIcons.SignalMedium,
  },
  SignalZero: {
    name: '无信号',
    englishName: 'Signal Zero',
    category: '网络连接',
    keywords: ['无信号', 'signal', 'zero', '无网络'],
    icon: LucideIcons.SignalZero,
  },

  // 其他常用图标 Other Common Icons
  Lightbulb: {
    name: '灯泡',
    englishName: 'Lightbulb',
    category: '其他',
    keywords: ['灯泡', 'lightbulb', '想法', '创意', '灵感'],
    icon: LucideIcons.Lightbulb,
  },
  LightbulbOff: {
    name: '关闭灯泡',
    englishName: 'Lightbulb Off',
    category: '其他',
    keywords: ['关闭灯泡', 'lightbulb', 'off', '熄灭'],
    icon: LucideIcons.LightbulbOff,
  },
  Flag: {
    name: '旗帜',
    englishName: 'Flag',
    category: '其他',
    keywords: ['旗帜', 'flag', '标记', '国家', '标志'],
    icon: LucideIcons.Flag,
  },
  FlagTriangleLeft: {
    name: '三角旗',
    englishName: 'Triangle Flag',
    category: '其他',
    keywords: ['三角旗', 'flag', 'triangle', '标记'],
    icon: LucideIcons.FlagTriangleLeft,
  },
  Anchor: {
    name: '锚',
    englishName: 'Anchor',
    category: '其他',
    keywords: ['锚', 'anchor', '船', '海洋', '固定'],
    icon: LucideIcons.Anchor,
  },
  Briefcase: {
    name: '公文包',
    englishName: 'Briefcase',
    category: '其他',
    keywords: ['公文包', 'briefcase', '工作', '商务', '职业'],
    icon: LucideIcons.Briefcase,
  },
  Feather: {
    name: '羽毛',
    englishName: 'Feather',
    category: '其他',
    keywords: ['羽毛', 'feather', '轻盈', '鸟类'],
    icon: LucideIcons.Feather,
  },
  Flame: {
    name: '火焰',
    englishName: 'Flame',
    category: '其他',
    keywords: ['火焰', 'flame', '热门', '火', '燃烧'],
    icon: LucideIcons.Flame,
  },
  Gem: {
    name: '宝石',
    englishName: 'Gem',
    category: '其他',
    keywords: ['宝石', 'gem', '钻石', '珍贵', '价值'],
    icon: LucideIcons.Gem,
  },
  Glasses: {
    name: '眼镜',
    englishName: 'Glasses',
    category: '其他',
    keywords: ['眼镜', 'glasses', '视力', '阅读'],
    icon: LucideIcons.Glasses,
  },
  Handshake: {
    name: '握手',
    englishName: 'Handshake',
    category: '其他',
    keywords: ['握手', 'handshake', '合作', '协议', '友好'],
    icon: LucideIcons.Handshake,
  },
  Inbox: {
    name: '收件箱',
    englishName: 'Inbox',
    category: '其他',
    keywords: ['收件箱', 'inbox', '邮件', '消息', '接收'],
    icon: LucideIcons.Inbox,
  },
  Magnet: {
    name: '磁铁',
    englishName: 'Magnet',
    category: '其他',
    keywords: ['磁铁', 'magnet', '吸引', '磁性'],
    icon: LucideIcons.Magnet,
  },
  Rocket: {
    name: '火箭',
    englishName: 'Rocket',
    category: '其他',
    keywords: ['火箭', 'rocket', '启动', '快速', '发射'],
    icon: LucideIcons.Rocket,
  },
  Umbrella: {
    name: '雨伞',
    englishName: 'Umbrella',
    category: '其他',
    keywords: ['雨伞', 'umbrella', '雨天', '保护', '遮挡'],
    icon: LucideIcons.Umbrella,
  },
  ZapOff: {
    name: '关闭闪电',
    englishName: 'Lightning Off',
    category: '其他',
    keywords: ['关闭闪电', 'lightning', 'off', '断电'],
    icon: LucideIcons.ZapOff,
  },
};

interface IconPickerProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function IconPicker({
  value,
  onChange,
  placeholder = '点击选择图标',
  disabled = false,
}: IconPickerProps) {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');

  // 获取所有分类
  const categories = useMemo(() => {
    const cats = new Set(Object.values(iconMap).map((icon) => icon.category));
    return ['全部', ...Array.from(cats).sort()];
  }, []);

  // 过滤图标 - 支持中英文搜索和分类筛选
  const filteredIcons = useMemo(() => {
    let icons = Object.entries(iconMap);

    // 分类筛选
    if (selectedCategory !== '全部') {
      icons = icons.filter(
        ([, iconData]) => iconData.category === selectedCategory,
      );
    }

    // 搜索筛选
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      icons = icons.filter(([key, { name, englishName, keywords }]) => {
        return (
          name.includes(searchText) ||
          englishName.toLowerCase().includes(searchLower) ||
          key.toLowerCase().includes(searchLower) ||
          keywords.some((keyword) =>
            keyword.toLowerCase().includes(searchLower),
          )
        );
      });
    }

    return icons;
  }, [searchText, selectedCategory]);

  // 获取选中的图标
  const selectedIcon = value ? iconMap[value as keyof typeof iconMap] : null;

  const handleIconSelect = (iconKey: string) => {
    onChange?.(iconKey);
    setIsModalOpen(false);
    setSearchText('');
    setSelectedCategory('全部');
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSearchText('');
    setSelectedCategory('全部');
  };

  const handleInputClick = () => {
    if (disabled) return;
    setIsModalOpen(true);
  };

  return (
    <>
      <Input
        value={
          selectedIcon
            ? `${selectedIcon.name} (${selectedIcon.englishName})`
            : ''
        }
        placeholder={placeholder}
        readOnly
        disabled={disabled}
        onClick={handleInputClick}
        className="cursor-pointer"
        prefix={
          selectedIcon ? (
            <selectedIcon.icon className="w-4 h-4 text-gray-500" />
          ) : (
            <Search className="w-4 h-4 text-gray-400" />
          )
        }
        style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
      />

      <Modal
        title="选择图标"
        open={isModalOpen}
        onCancel={handleModalClose}
        footer={null}
        width={'62%'}
      >
        <div className="space-y-4">
          {/* 搜索框 */}
          <Input
            placeholder="搜索图标名称"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            prefix={<Search className="w-4 h-4 text-gray-400" />}
            allowClear
          />

          {/* 分类筛选 */}
          <div className="flex flex-wrap gap-1">
            {categories.map((category) => (
              <Badge
                key={category}
                color={selectedCategory === category ? 'blue' : 'default'}
                className="cursor-pointer px-2 py-1"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>

          {/* 图标网格 */}
          <div className="max-h-96 overflow-y-auto">
            {filteredIcons.length > 0 ? (
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 p-2">
                {filteredIcons.map(
                  ([key, { name, englishName, icon: IconComponent }]) => (
                    <Tooltip key={key} title={`${name} (${englishName})`}>
                      <div
                        onClick={() => handleIconSelect(key)}
                        className={`
                        flex flex-col items-center p-3 rounded-lg border cursor-pointer
                        transition-all duration-200 hover:bg-blue-50 hover:border-blue-300
                        ${value === key ? 'bg-blue-50 border-blue-300' : 'border-gray-200'}
                      `}
                      >
                        <IconComponent className="w-6 h-6 text-gray-600 mb-2" />
                        <span className="text-xs text-gray-700 text-center leading-tight truncate w-full">
                          {name}
                        </span>
                        <span className="text-xs text-gray-400 text-center truncate w-full">
                          {englishName}
                        </span>
                      </div>
                    </Tooltip>
                  ),
                )}
              </div>
            ) : (
              <Empty description="未找到匹配的图标" className="py-8" />
            )}
          </div>

          {/* 统计信息 */}
          <div className="text-sm text-gray-500 text-center border-t pt-3">
            {searchText || selectedCategory !== '全部' ? (
              <>找到 {filteredIcons.length} 个图标</>
            ) : (
              <>共 {Object.keys(iconMap).length} 个图标可选</>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}
