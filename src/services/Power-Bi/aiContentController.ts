// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** getAiContent GET /api/ai/getAiContent */
export async function getAiContentUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseListAicontents_>('/api/ai/getAiContent', {
    method: 'GET',
    ...(options || {}),
  });
}

/** queryAi GET /api/ai/query */
export async function queryAiUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.queryAiUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseString_>('/api/ai/query', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** queryAiBySse GET /api/ai/queryBySse */
export async function queryAiBySseUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.queryAiBySseUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.SseEmitter>('/api/ai/queryBySse', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
