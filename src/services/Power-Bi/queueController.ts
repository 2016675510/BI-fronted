// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** addTask GET /api/queue/add */
export async function addTaskUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.addTaskUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<any>('/api/queue/add', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** getStatus GET /api/queue/get */
export async function getStatusUsingGet(options?: { [key: string]: any }) {
  return request<string>('/api/queue/get', {
    method: 'GET',
    ...(options || {}),
  });
}
