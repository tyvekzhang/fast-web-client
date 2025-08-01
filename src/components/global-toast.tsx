'use client';
import { App } from 'antd';
import React, { memo } from 'react';

import type { MessageInstance } from 'antd/es/message/interface';
import type { ModalStaticFunctions } from 'antd/es/modal/confirm';
import type { NotificationInstance } from 'antd/es/notification/interface';

let message: MessageInstance;
let notification: NotificationInstance;
let modal: Omit<ModalStaticFunctions, 'warn'>;

export const GlobalToast: React.FC = memo(() => {
  const staticFunction = App.useApp();
  message = staticFunction.message;
  modal = staticFunction.modal;
  notification = staticFunction.notification;
  return null;
});

export const notifySuccess = (msg: string) => {
  notification.success({
    message: msg,
    placement: 'bottomRight',
    className: 'custom-notify',
  });
};

export const notifyError = (msg: string) => {
  notification.error({
    message: msg,
    placement: 'bottomRight',
    className: 'custom-notify',
  });
};

export { message, modal, notification };
