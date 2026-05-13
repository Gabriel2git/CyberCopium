# PR 冲突一键解决（`src/app/api/generate/route.ts`）

如果 GitHub 显示该文件有 2 处冲突，请按下面做：

## 1) 直接采用最终正确实现
在冲突编辑器中：
- 第一处冲突（顶部 client 初始化块）选择 **Accept current change**。
- 第二处冲突（`POST` 内 key 检查）选择 **Accept current change**。

然后点击 **Mark as resolved** 并提交。

## 2) 正确版本应满足以下条件
- 文件中存在 `getApiKey()` 和 `getClient()`。
- `POST` 中先执行 `const client = getClient();`，然后 `if (!client) { ...503... }`。
- 文件中不能包含冲突标记：`<<<<<<<` / `=======` / `>>>>>>>`。

## 3) 本地校验命令
```bash
rg -n "^(<<<<<<<|=======|>>>>>>>)" src/app/api/generate/route.ts
npm run build
```

- 第一条命令没有任何输出 = 冲突已清理干净。
- 第二条命令通过 = 可部署到 Vercel。
