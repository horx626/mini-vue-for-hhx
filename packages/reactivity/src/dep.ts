/*
 * @Author: hxxxxxx 1584694417@qq.com
 * @Date: 2022-11-07 14:35:27
 * @LastEditors: hxxxxxx 1584694417@qq.com
 * @LastEditTime: 2022-11-15 15:12:01
 * @FilePath: \mini-vue-master\packages\reactivity\src\dep.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 用于存储所有的 effect 对象
export function createDep(effects?) {
  const dep = new Set(effects);
  return dep;
}
