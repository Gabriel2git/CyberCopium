# UI/UX 优化计划

## 修改目标

根据用户反馈，对页面样式和交互进行以下优化：

1. **按钮居中对称** - 让所有按钮在页面中居中对齐，视觉更加平衡
2. **添加免责声明** - 在页面底部添加"⚠️ 本产品仅供情绪调整，不能替代专业心理咨询"
3. **跳转新页面** - 点击提交按钮后跳转到新的结果页面，而不是在原页面滚动显示

---

## 修改清单

### 1. 按钮居中对称

**涉及组件**: `InputSection.tsx`, `FeedbackSection.tsx`

**修改内容**:
- 输入框下方的"吸一口赛博氧气"按钮需要居中
- 示例语句标签需要居中排列
- 反馈按钮（"重新生成"、"我去做了"）需要居中对齐
- 确保按钮在不同屏幕尺寸下都保持居中

**技术实现**:
```tsx
// InputSection.tsx
<div className="flex flex-col items-center gap-4">
  <button className="...">吸一口赛博氧气</button>
  <div className="flex flex-wrap gap-2 justify-center">
    {/* 示例语句 */}
  </div>
</div>
```

### 2. 添加免责声明

**涉及组件**: `page.tsx` 或新增 `Footer.tsx`

**修改内容**:
- 在页面最底部添加免责声明
- 使用醒目的黄色/橙色警告图标
- 文字颜色使用灰色，不要太抢眼但要清晰可读
- 固定在页面底部或跟随内容流

**样式参考**:
```tsx
<div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
  <p className="text-center text-sm text-gray-500 dark:text-gray-400">
    ⚠️ 本产品仅供情绪调整，不能替代专业心理咨询
  </p>
</div>
```

### 3. 跳转新页面交互

**涉及文件**: 
- `src/app/page.tsx` → 改为纯输入页
- `src/app/result/page.tsx` → 新建结果展示页
- 使用路由跳转代替状态显示

**修改内容**:

#### 3.1 修改首页 (`page.tsx`)
- 只保留输入功能和 Hero 区域
- 移除结果展示相关代码
- 提交后跳转到 `/result` 页面
- 使用 URL 参数或 localStorage 传递用户输入

**方案选择**:
- **方案 A**: URL 参数传递（适合短文本，但可能编码复杂）
- **方案 B**: localStorage 传递（推荐，简单可靠）
- **方案 C**: 服务端 Session（过重，不适合 MVP）

**推荐方案 B - localStorage**:
```tsx
// 提交时
localStorage.setItem('copium_input', input);
router.push('/result');

// 清理时（可选）
localStorage.removeItem('copium_input');
```

#### 3.2 创建结果页 (`src/app/result/page.tsx`)
- 从 localStorage 读取用户输入
- 调用 API 获取生成结果
- 展示五件套卡片、贴纸、反馈按钮
- 添加"返回首页"按钮
- 处理刷新页面数据丢失的情况

**页面结构**:
```tsx
export default function ResultPage() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [result, setResult] = useState<GenerationResult | null>(null);
  
  // 从 localStorage 读取输入
  useEffect(() => {
    const savedInput = localStorage.getItem('copium_input');
    if (savedInput) {
      setInput(savedInput);
      // 调用 API 生成结果
    } else {
      // 没有输入数据，跳转回首页
      router.push('/');
    }
  }, []);
  
  // ...渲染结果
}
```

#### 3.3 添加返回导航
- 在结果页添加"返回首页"按钮
- 可以放在顶部或底部
- 点击后清空结果数据，返回首页

---

## 文件变更清单

### 修改文件
1. `src/app/page.tsx` - 简化为纯输入页
2. `src/components/InputSection.tsx` - 按钮居中
3. `src/components/FeedbackSection.tsx` - 按钮居中

### 新增文件
1. `src/app/result/page.tsx` - 结果展示页
2. `src/components/Footer.tsx` - 页脚免责声明（可选）

---

## 验收标准

### 功能验收
- [ ] 首页所有按钮（提交、示例语句）居中对齐
- [ ] 结果页反馈按钮（重新生成、我去做了）居中对齐
- [ ] 页面底部有清晰的免责声明
- [ ] 点击提交后跳转到新页面 `/result`
- [ ] 结果页能正确显示生成的五件套内容
- [ ] 结果页有"返回首页"按钮
- [ ] 刷新结果页不会丢失数据（至少在一次会话内）

### 视觉验收
- [ ] 按钮在移动端和桌面端都保持居中
- [ ] 免责声明清晰可见但不抢眼
- [ ] 页面跳转流畅，无明显延迟
- [ ] 整体布局对称、平衡

### 交互验收
- [ ] 提交后页面跳转有加载状态提示
- [ ] 如果 localStorage 无数据，结果页自动跳转回首页
- [ ] 返回按钮点击后能正常返回首页
- [ ] 可以正常重新生成结果

---

## 开发顺序建议

1. **第一步**: 修改按钮居中样式（影响最小，快速验证）
2. **第二步**: 添加免责声明页脚（独立功能）
3. **第三步**: 创建结果页面路由
4. **第四步**: 修改首页，实现跳转逻辑
5. **第五步**: 完善结果页功能和边界处理
6. **第六步**: 测试所有交互流程

---

## 技术注意事项

### localStorage 使用注意
1. 设置过期时间或清理机制
2. 考虑隐私模式下的兼容性
3. 数据大小限制（5MB 左右，足够用）

### 路由跳转优化
1. 使用 Next.js 的 `useRouter` 进行客户端跳转
2. 考虑添加页面切换动画
3. 处理浏览器后退按钮的情况

### SEO 考虑
1. 结果页不需要 SEO，可以添加 `noindex`
2. 首页保持完整的 meta 信息

---

## 预估工作量

- **按钮居中**: 15 分钟
- **免责声明**: 10 分钟
- **结果页面开发**: 1-1.5 小时
- **测试和优化**: 30 分钟

**总计**: 约 2-2.5 小时
