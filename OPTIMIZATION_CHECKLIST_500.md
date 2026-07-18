# ChainSure / rialo- 500 项更新清单

> 编号：`CS-001` ~ `CS-500`  
> 用法：完成后将 `[ ]` 改为 `[x]`  
> 优先级：P0 必做 · P1 应做 · P2 可选 · P3 暂缓/删除

---

## A. 全局壳层 · App / Nav / Footer（CS-001 ~ CS-040）

- [x] CS-001 [P1] App.tsx 增加 URL hash 路由（#/home）便于分享
- [x] CS-002 [P2] App.tsx 页面切换 fadeIn 过渡动画
- [x] CS-003 [P1] App.tsx main 区 min-height 避免页脚跳动
- [x] CS-004 [P2] App.tsx 404 未知 page fallback
- [x] CS-005 [P1] NavBar Logo 点击回首页并 scroll top
- [x] CS-006 [P1] NavBar 当前页 nav 项 aria-current
- [x] CS-007 [P1] NavBar 语言菜单点击外部关闭
- [x] CS-008 [P1] NavBar 语言菜单 Esc 关闭
- [x] CS-009 [P2] NavBar 移动端汉堡菜单
- [x] CS-010 [P2] NavBar 移动端隐藏次要按钮
- [x] CS-011 [P1] NavBar 余额 Anim 小数 ETH 格式
- [x] CS-012 [P1] NavBar 连接中 loading 禁用重复点击
- [x] CS-013 [P1] NavBar 已连接点击跳转 wallet（已有，验 UX）
- [x] CS-014 [P2] NavBar 顶栏增加断开连接下拉
- [x] CS-015 [P1] NavBar disconnect 接入（当前 void）
- [ ] CS-016 [P2] NavBar sticky 滚动阴影增强
- [ ] CS-017 [P1] SiteFooter Program ID 一键复制
- [ ] CS-018 [P1] SiteFooter 导航链接 hover 无障碍 focus 环
- [ ] CS-019 [P2] SiteFooter 增加 GitHub 仓库外链
- [ ] CS-020 [P2] SiteFooter 增加 Demo 文档链接
- [ ] CS-021 [P1] SiteFooter 移动端三列改单列堆叠
- [ ] CS-022 [P2] SiteFooter 徽章 tooltip 说明
- [ ] CS-023 [P1] SiteFooter copyright 年份自动（已有，验 i18n）
- [ ] CS-024 [P2] SiteFooter 深色渐变与 body 背景衔接
- [ ] CS-025 [P1] 全站 maxWidth 统一 1140/1080 规范
- [ ] CS-026 [P1] 全站 padding 移动端 32→16
- [ ] CS-027 [P2] 全站 prefers-reduced-motion 降级动画
- [ ] CS-028 [P1] 全站 focus-visible 键盘导航样式
- [ ] CS-029 [P2] 全站 skip-to-content 链接
- [ ] CS-030 [P1] 全站 document title 随 page 变化
- [ ] CS-031 [P2] 全站 favicon / og meta（index.html）
- [ ] CS-032 [P1] index.html lang 属性随 i18n 切换
- [ ] CS-033 [P2] 全站 toast 通知组件（成功/失败）
- [ ] CS-034 [P1] 全站 error boundary 防白屏
- [ ] CS-035 [P2] 全站 offline 提示条
- [ ] CS-036 [P1] Context 拆分 AppContext（wallet vs policy）
- [ ] CS-037 [P2] 引入 react-router-dom 替代 page 字符串
- [ ] CS-038 [P2] localStorage 持久化 policies/claims
- [ ] CS-039 [P1] disconnect 时 txHistory 行为统一（清空或保留文档化）
- [ ] CS-040 [P2] 全站 Cmd+K 快捷命令面板（跳转页）

---

## B. 首页 · 产品线 Tab（CS-041 ~ CS-055）

- [ ] CS-041 [P1] 产品线 Tab 横向 scroll snap
- [ ] CS-042 [P1] 选中 Tab 键盘左右切换
- [ ] CS-043 [P1] health 占位 Tab tooltip 说明即将上线
- [ ] CS-044 [P3] 清理 i18n 物流/车险/寿险 dead keys
- [ ] CS-045 [P1] 产品线 icon 与 Badge 对齐
- [ ] CS-046 [P2] 产品线 Tab 增加 NFT 快捷跳转锚点
- [ ] CS-047 [P1] 切换 product 时 scroll 到标题区
- [ ] CS-048 [P2] product 状态 URL hash 同步
- [ ] CS-049 [P1] inactive 产品 cursor not-allowed 一致
- [ ] CS-050 [P2] 产品线 Tab aria-selected
- [ ] CS-051 [P1] page_title 区 margin 统一
- [ ] CS-052 [P1] page_desc threshold 参数验 DELAY_THRESHOLD
- [ ] CS-053 [P2] 标题区增加 breadcrumb
- [ ] CS-054 [P2] 首页 hero 统计（总保单/总理赔 demo 数）
- [ ] CS-055 [P1] 首页未连接钱包 gentle CTA 条

---

## C. 首页 · 航班选择（CS-056 ~ CS-120）

- [ ] CS-056 [P1] SegmentedControl 全部/国内/国际（已完成，验 4 语言）
- [ ] CS-057 [P1] SearchInput 搜索（已完成，验清空）
- [ ] CS-058 [P1] flight_list_count 计数准确
- [ ] CS-059 [P1] 筛选切换时保持搜索词
- [ ] CS-060 [P1] 搜索无结果空状态（已完成，验样式）
- [ ] CS-061 [P1] 航班列表虚拟滚动（>50 条时）
- [ ] CS-062 [P2] 航班列表键盘上下选择
- [ ] CS-063 [P1] 选中航班 scroll into view
- [ ] CS-064 [P1] 航班卡片 hover（已完成，验 touch）
- [ ] CS-065 [P1] 国际 badge 与延误 badge 不重叠
- [ ] CS-066 [P1] 详情按钮 stopPropagation（已有，验）
- [ ] CS-067 [P2] 航班卡片骨架屏 loading
- [ ] CS-068 [P1] CA1234 国内航线数据校验
- [ ] CS-069 [P1] MU5678 国内航线数据校验
- [ ] CS-070 [P1] CZ3090 国内航线数据校验
- [ ] CS-071 [P1] HU7801 国内航线数据校验
- [ ] CS-072 [P1] 3U8891 国内航线数据校验
- [ ] CS-073 [P1] MF8452 国内航线数据校验
- [ ] CS-074 [P1] ZH9123 国内航线数据校验
- [ ] CS-075 [P1] SC4876 国内航线数据校验
- [ ] CS-076 [P1] CA985 国际航线数据校验
- [ ] CS-077 [P1] SQ807 国际航线数据校验
- [ ] CS-078 [P1] NH960 国际航线数据校验
- [ ] CS-079 [P1] KE831 国际航线数据校验
- [ ] CS-080 [P1] BA168 国际航线数据校验
- [ ] CS-081 [P1] EK306 国际航线数据校验
- [ ] CS-082 [P1] UA888 国际航线 data 校验
- [ ] CS-083 [P1] 航班 onTimeRate 显示 0–100%
- [ ] CS-084 [P1] 航班 duration 小时分钟格式
- [ ] CS-085 [P1] 航班 distanceKm 千 km 格式
- [ ] CS-086 [P2] 航班按准点率排序选项
- [ ] CS-087 [P2] 航班按延误排序选项
- [ ] CS-088 [P1] FlightDetailModal 遮罩点击关闭
- [ ] CS-089 [P1] FlightDetailModal Esc 关闭
- [ ] CS-090 [P1] FlightDetailModal 机型字段 i18n
- [ ] CS-091 [P1] FlightDetailModal 航站楼 dep/arr
- [ ] CS-092 [P1] FlightDetailModal 天气区 i18n（condition 硬编码改 key）
- [ ] CS-093 [P1] FlightDetailModal 天气 emoji 与条件一致
- [ ] CS-094 [P1] FlightDetailModal 延误分布条形图 a11y
- [ ] CS-095 [P1] FlightDetailModal 选择此航班后关闭并 scroll
- [ ] CS-096 [P1] FlightDetailModal 移动端全屏
- [ ] CS-097 [P1] FlightDetailModal focus trap
- [ ] CS-098 [P2] FlightDetailModal 分享航班 deep link
- [ ] CS-099 [P1] insurance_tip 区 threshold 用常量
- [ ] CS-100 [P1] flight_demo_tip / good_history 条件正确

---

## D. 首页 · 日期与方案（CS-101 ~ CS-135）

- [ ] CS-101 [P1] date input min=tomorrow 校验
- [ ] CS-102 [P1] 明天/后天/+7 Segmented（已完成，验未选态）
- [ ] CS-103 [P1] formatDate 中文/日/韩/en 格式（已有，验）
- [ ] CS-104 [P1] select_future_date 警告色
- [ ] CS-105 [P2] 日历 picker 样式统一
- [ ] CS-106 [P1] TIERS basic 0.5/2 ETH（已完成）
- [ ] CS-107 [P1] TIERS standard 1/5 ETH（已完成）
- [ ] CS-108 [P1] TIERS premium 2/10 ETH（已完成）
- [ ] CS-109 [P1] TIERS vip 5/20 ETH（已完成）
- [ ] CS-110 [P1] 方案卡片选中态边框
- [ ] CS-111 [P1] 方案卡片键盘 Enter 选择
- [ ] CS-112 [P1] rate_hint 费率文案准确
- [ ] CS-113 [P1] payout_label threshold 参数
- [ ] CS-114 [P2] 方案对比表（四档并列）
- [ ] CS-115 [P1] EthAmount 组件抽离（字号 sm/md/lg）
- [ ] CS-116 [P1] 方案区 ETH 字号统一 15–16px
- [ ] CS-117 [P2] 方案推荐 badge（标准档）
- [ ] CS-118 [P1] ti 状态与 purchase 参数一致
- [ ] CS-119 [P2] 方案 tooltip 解释 rate
- [ ] CS-120 [P1] 切换航班后摘要区同步

---

## E. 首页 · 订单确认与购买（CS-121 ~ CS-145）

- [ ] CS-121 [P1] 右栏摘要 DEP/ARR 布局
- [ ] CS-122 [P1] 摘要准点率/时长/距离
- [ ] CS-123 [P1] you_pay / you_get 双格对比
- [ ] CS-124 [P1] 订单确认 ETH 字号 22px（已完成，验）
- [ ] CS-125 [P1] policy_details 四行信息完整
- [ ] CS-126 [P1] return_rate multiplier 计算正确
- [ ] CS-127 [P1] insufficient_balance 错误提示
- [ ] CS-128 [P1] daily_limit_reached 错误提示
- [ ] CS-129 [P1] future_date_only 阻断购买
- [ ] CS-130 [P1] connect_first 卡片 CTA
- [ ] CS-131 [P1] confirm_pay 按钮 busy 态
- [ ] CS-132 [P1] 购买成功跳转 policies
- [ ] CS-133 [P1] 购买失败 error 展示
- [ ] CS-134 [P2] 购买成功 toast
- [ ] CS-135 [P2] 购买前二次确认 modal

---

## F. 首页 · 响应式（CS-136 ~ CS-150）

- [ ] CS-136 [P1] flight 双栏 grid <960px 单列
- [ ] CS-137 [P1] 右栏摘要移到日期下方或 sticky
- [ ] CS-138 [P2] 购买按钮 mobile fixed bottom
- [ ] CS-139 [P1] 产品线 Tab 小屏 scroll
- [ ] CS-140 [P1] FlightDetailModal 小屏 padding
- [ ] CS-141 [P2] 搜索框 iOS 样式
- [ ] CS-142 [P1] 航班列表 maxHeight 随 vh 计算
- [ ] CS-143 [P2] landscape 模式布局
- [ ] CS-144 [P1] touch target 最小 44px
- [ ] CS-145 [P2] safe-area-inset 底部 padding

---

## G. 世界杯 WorldCupSection（CS-146 ~ CS-210）

- [ ] CS-146 [P1] WC 横幅标题 i18n
- [ ] CS-147 [P1] wc_demo 一键演示 connect+购买+结算
- [ ] CS-148 [P1] Tab insure/records 切换
- [ ] CS-149 [P1] 4 场 WC_MATCHES 可选
- [ ] CS-150 [P1] 场次卡片显示阶段/日期/场馆
- [ ] CS-151 [P1] 主客队 VS 布局
- [ ] CS-152 [P1] 16 队 WC_TEAMS 数据完整
- [ ] CS-153 [P1] 选队 win/draw 赔率展示
- [ ] CS-154 [P1] PLANS 50/100/200/500 → 0.5/1/2/5 ETH 缩小 100 倍
- [ ] CS-155 [P1] WC 保费 ethToKelvin 换算
- [ ] CS-156 [P1] 赔付 = premium × odds 显示
- [ ] CS-157 [P1] wc_please_select_team 占位
- [ ] CS-158 [P1] 投保按钮状态机
- [ ] CS-159 [P1] purchaseWCPolicy 经 SDK 统一（可选）
- [ ] CS-160 [P1] records 空状态 wc_no_bets
- [ ] CS-161 [P1] 统计：全部/已赔付/累计赔付
- [ ] CS-162 [P1] 投注 Card 球队/类型/赔率
- [ ] CS-163 [P1] 投注 TX 截断
- [ ] CS-164 [P1] wc_settle_this 结算按钮
- [ ] CS-165 [P1] settleWCPolicy 结果 i18n（比分硬编码改 key）
- [ ] CS-166 [P1] settleWCPolicy log i18n
- [ ] CS-167 [P0] Policies SettleModal WC 结果 wcResult bug 修复
- [ ] CS-168 [P1] WC 保单在 Policies 页展示 flag
- [ ] CS-169 [P1] WC lifecycle ready 逻辑
- [ ] CS-170 [P2] WC 球队搜索/filter
- [ ] CS-171 [P2] WC 赔率历史图表 placeholder
- [ ] CS-172 [P1] WC 保额 EthAmount 组件
- [ ] CS-173 [P2] WC 分享投注卡片
- [ ] CS-174 [P1] WC demo 队巴西 bra 固定
- [ ] CS-175 [P1] WC 结算随机胜率可配置 demo
- [ ] CS-176 [P2] WC records 筛选 active/claimed
- [ ] CS-177 [P1] WC 与 flight 保单 type 字段一致
- [ ] CS-178 [P2] WC 赛事倒计时
- [ ] CS-179 [P1] WC 移动端双栏改单栏
- [ ] CS-180 [P2] WC Tab 键盘切换
- [ ] CS-181 [P1] WC 投保成功切 records tab
- [ ] CS-182 [P1] WC footer 重复已移除（验）
- [ ] CS-183 [P2] WC 队旗 emoji 备用 png
- [ ] CS-184 [P1] WC 平局赔率展示
- [ ] CS-185 [P2] WC 多语言队名
- [ ] CS-186 [P1] WC 保费余额不足提示
- [ ] CS-187 [P2] WC 日限额与 flight 共用 MAX
- [ ] CS-188 [P1] WC claimed 金额格式 n()
- [ ] CS-189 [P2] WC 比赛结果动画
- [ ] CS-190 [P1] WC 购买 txHistory wc_purchase 类型
- [ ] CS-191 [P1] WC 理赔 txHistory wc_claim 类型
- [ ] CS-192 [P2] WC 海报图 banner
- [ ] CS-193 [P1] WC 对阵信息条样式
- [ ] CS-194 [P2] WC 深色模式对比度 audit
- [ ] CS-195 [P1] WC 表单 aria labels
- [ ] CS-196 [P2] WC 离线 demo 数据 seed
- [ ] CS-197 [P1] WC policy address 格式统一
- [ ] CS-198 [P2] WC 导出 CSV 记录
- [ ] CS-199 [P1] WC 与 PolicyDetailPanel 兼容
- [ ] CS-200 [P1] WC 时间线 policyStatus 分支
- [ ] CS-201 [P1] bra 球队数据校验
- [ ] CS-202 [P1] arg 球队数据校验
- [ ] CS-203 [P1] fra 球队数据校验
- [ ] CS-204 [P1] eng 球队数据校验
- [ ] CS-205 [P2] 其余 12 队批量校验
- [ ] CS-206 [P2] WC_MATCHES 8强场次 1
- [ ] CS-207 [P2] WC_MATCHES 8强场次 2
- [ ] CS-208 [P2] WC_MATCHES 4强场次 1
- [ ] CS-209 [P2] WC_MATCHES 4强场次 2
- [ ] CS-210 [P2] WC 决赛场次 placeholder

---

## H. NFT Mint 区（CS-211 ~ CS-245）

- [ ] CS-211 [P2] NFT 三列布局（已完成，验 mobile）
- [ ] CS-212 [P1] nft_dev_badge 与 dev_mode 一致
- [ ] CS-213 [P1] nft_mint_locked disabled 说明
- [ ] CS-214 [P1] 上线通知 notified 本地态
- [ ] CS-215 [P2] 通知登记接后端/webhook
- [ ] CS-216 [P1] 3 个 sample NFT 文案 i18n
- [ ] CS-217 [P1] rarity 颜色对比度
- [ ] CS-218 [P2] 进度条 65/40/30/10 动画
- [ ] CS-219 [P1] 4 feature 行图标对齐
- [ ] CS-220 [P2] NFT 与主色 purple 统一
- [ ] CS-221 [P1] nft-grid 960px 单列（已有）
- [ ] CS-222 [P2] NFT metadata JSON 预览
- [ ] CS-223 [P2] NFT 合约地址 placeholder
- [ ] CS-224 [P2] Mint 价 ETH 显示
- [ ] CS-225 [P2] NFT 钱包 connect 前置
- [ ] CS-226 [P1] NFT 区 marginTop 与 footer 间距
- [ ] CS-227 [P2] NFT carousel 滑动
- [ ] CS-228 [P2] NFT 稀有度 legend
- [ ] CS-229 [P1] nft_total_supply 数字格式
- [ ] CS-230 [P2] NFT ipfs 链接 placeholder
- [ ] CS-231 [P2] NFT 市场 10% 进度说明
- [ ] CS-232 [P1] NFT 区标题分隔线样式
- [ ] CS-233 [P2] NFT a11y 进度 role=progressbar
- [ ] CS-234 [P2] NFT 铸造成功 confetti
- [ ] CS-235 [P2] NFT 盲盒随机 preview
- [ ] CS-236 [P1] 未使用 nft key 清理或接入
- [ ] CS-237 [P2] NFT 与保单联动 badge
- [ ] CS-238 [P2] NFT OpenSea 链接 placeholder
- [ ] CS-239 [P2] NFT 白名单 demo
- [ ] CS-240 [P1] NFT 按钮 focus 样式
- [ ] CS-241 [P2] NFT 视频背景 placeholder
- [ ] CS-242 [P2] NFT FAQ accordion
- [ ] CS-243 [P2] NFT 路线图时间轴
- [ ] CS-244 [P2] NFT 团队/审计 placeholder
- [ ] CS-245 [P2] NFT 切换独立路由页

---

## I. 我的保单 PoliciesPage（CS-246 ~ CS-305）

- [ ] CS-246 [P1] 未连接 DemoEntryCard
- [ ] CS-247 [P1] demo 连接+addDemoPolicy+settle
- [ ] CS-248 [P1] 页头 demo_btn + policies_count
- [ ] CS-249 [P1] 空状态 go_insure + demo
- [ ] CS-250 [P1] active/history 分区标题
- [ ] CS-251 [P1] 保单 Card lifecycle badge
- [ ] CS-252 [P1] PDA + TX 摘要（已完成）
- [ ] CS-253 [P1] 查看链上详情按钮
- [ ] CS-254 [P1] 立即结算按钮条件
- [ ] CS-255 [P1] waiting badge 未来航班
- [ ] CS-256 [P1] claimed + payout 金额
- [ ] CS-257 [P1] expired badge
- [ ] CS-258 [P1] WC 保单 flag + 类型
- [ ] CS-259 [P1] history opacity 0.75
- [ ] CS-260 [P0] PolicyDetailPanel 集成
- [ ] CS-261 [P1] detailPolicy 结算后刷新
- [ ] CS-262 [P1] SettleModal 6 步指示器
- [ ] CS-263 [P1] SettleModal 进度条动画
- [ ] CS-264 [P1] settle_step1~6 i18n
- [ ] CS-265 [P1] SettleModal 假 tx hash 展示
- [ ] CS-266 [P1] 航班延误结果对比 DELAY_THRESHOLD
- [ ] CS-267 [P0] WC 结算结果 wcResult 展示修复
- [ ] CS-268 [P1] settle_condition_met / not_met
- [ ] CS-269 [P1] settle_done_onchain 文案
- [ ] CS-270 [P1] SettleModal 副标题 i18n（现硬编码 EN）
- [ ] CS-271 [P1] SettleModal Esc 关闭
- [ ] CS-272 [P2] SettleModal 禁止结算中关闭
- [ ] CS-273 [P1] settling 防重复点击
- [ ] CS-274 [P1] settleTxSignature 写入 policy
- [ ] CS-275 [P1] demo 保单 premium 1 / payout 5
- [ ] CS-276 [P2] 保单列表 sort 按时间
- [ ] CS-277 [P2] 保单 filter 按状态
- [ ] CS-278 [P2] 保单 search 按航班号
- [ ] CS-279 [P1] 保单 Card 键盘 accessible
- [ ] CS-280 [P2] 批量导出保单 JSON
- [ ] CS-281 [P2] 保单 QR 分享
- [ ] CS-282 [P1] 日限 hint 与 home 一致
- [ ] CS-283 [P2] 保单到期提醒 countdown
- [ ] CS-284 [P1] actualDelayMinutes 展示
- [ ] CS-285 [P1] wcResultScore 展示
- [ ] CS-286 [P2] 保单 pin 重要
- [ ] CS-287 [P1] PolicyStatus enum 类型安全
- [ ] CS-288 [P2] 保单分页 load more
- [ ] CS-289 [P1] 移动端 SettleModal 全屏
- [ ] CS-290 [P2] 结算音效 optional
- [ ] CS-291 [P1] oracle 等待文案 i18n
- [ ] CS-292 [P2] 结算失败 retry
- [ ] CS-293 [P1] claim 记录联动刷新
- [ ] CS-294 [P2] 保单打印样式
- [ ] CS-295 [P1] 空 active 仅有 history 布局
- [ ] CS-296 [P2] 保单 webhook 通知 placeholder
- [ ] CS-297 [P1] findClaim 匹配 policy.address
- [ ] CS-298 [P2] 保单 CSV 下载
- [ ] CS-299 [P1] demo tx amount -1 ETH
- [ ] CS-300 [P2] 保单详情从列表打开动画
- [ ] CS-301 [P1] 多保单同时 settling 互斥
- [ ] CS-302 [P2] 保单标签自定义
- [ ] CS-303 [P1] 航班 canSettle date<=today
- [ ] CS-304 [P1] WC canSettle 随时
- [ ] CS-305 [P2] 保单 archive 隐藏

---

## J. 链上详情 PolicyDetailPanel（CS-306 ~ CS-330）

- [ ] CS-306 [P1] Policy PDA 完整展示
- [ ] CS-307 [P1] Claim PDA 派生展示
- [ ] CS-308 [P1] 购买 TX hash
- [ ] CS-309 [P1] 结算 TX hash（settleTxSignature）
- [ ] CS-310 [P1] Program ID 展示
- [ ] CS-311 [P0] PDA 一键复制
- [ ] CS-312 [P0] TX 一键复制
- [ ] CS-313 [P1] 复制成功 toast
- [ ] CS-314 [P2] TX 跳转区块浏览器
- [ ] CS-315 [P1] lifecycle badge 四态
- [ ] CS-316 [P1] 时间线 4 步 purchase/wait/ready/settle
- [ ] CS-317 [P1] 时间线 done/active 样式
- [ ] CS-318 [P1] policy_step_delay_detail 参数
- [ ] CS-319 [P1] 保费/赔付 EthAmount
- [ ] CS-320 [P1] ready 态结算按钮
- [ ] CS-321 [P1] 关闭按钮 + 遮罩点击
- [ ] CS-322 [P1] WC 保单标题队旗
- [ ] CS-323 [P1] 航班保单标题 IATA
- [ ] CS-324 [P1] policy_onchain_hint 文案
- [ ] CS-325 [P2] 链上数据 refresh 按钮
- [ ] CS-326 [P2] Merkle proof placeholder 区
- [ ] CS-327 [P2] Oracle 来源列表 placeholder
- [ ] CS-328 [P1] 移动端详情全屏
- [ ] CS-329 [P1] focus trap modal
- [ ] CS-330 [P2] 详情分享链接

---

## K. policyStatus 逻辑（CS-331 ~ CS-345）

- [ ] CS-331 [P1] getPolicyLifecycle waiting
- [ ] CS-332 [P1] getPolicyLifecycle ready
- [ ] CS-333 [P1] getPolicyLifecycle claimed
- [ ] CS-334 [P1] getPolicyLifecycle expired
- [ ] CS-335 [P1] WC 默认 ready
- [ ] CS-336 [P1] getPolicyClaimPda 正确
- [ ] CS-337 [P1] buildPolicyTimeline 四步
- [ ] CS-338 [P1] WC wait step key
- [ ] CS-339 [P1] flight wait detail date 参数
- [ ] CS-340 [P2] 单元测试 lifecycle
- [ ] CS-341 [P2] Cancelled 状态 UI
- [ ] CS-342 [P1] today 时区边界
- [ ] CS-343 [P2] 时区用户 locale
- [ ] CS-344 [P1] settledAt 时间线展示
- [ ] CS-345 [P2] 状态变更 event log

---

## L. 理赔 ClaimsPage（CS-346 ~ CS-370）

- [ ] CS-346 [P1] 未连接 connect_first
- [ ] CS-347 [P1] claims_title 页头
- [ ] CS-348 [P1] 空状态 no_claims_desc_full
- [ ] CS-349 [P1] total_claimed Stat
- [ ] CS-350 [P1] 航班/世界杯笔数统计 i18n（现硬编码中文）
- [ ] CS-351 [P1] flightClaims 列表
- [ ] CS-352 [P1] wcClaims 列表
- [ ] CS-353 [P1] 理赔金额 n() + ETH
- [ ] CS-354 [P1] TX shortSig
- [ ] CS-355 [P1] 延误分钟 badge
- [ ] CS-356 [P1] WC 比分展示
- [ ] CS-357 [P1] 航班号显示修复（勿 split policy）
- [ ] CS-358 [P1] claim_time i18n 接入
- [ ] CS-359 [P2] 理赔 filter 按类型
- [ ] CS-360 [P2] 理赔 sort 按金额
- [ ] CS-361 [P2] 理赔详情 modal
- [ ] CS-362 [P1] DELAY_THRESHOLD 常量替代 120
- [ ] CS-363 [P2] 理赔图表 按月
- [ ] CS-364 [P2] 导出理赔 CSV
- [ ] CS-365 [P1] 理赔 Card hover
- [ ] CS-366 [P2] 理赔 push 通知 placeholder
- [ ] CS-367 [P1] 移动端列表紧凑
- [ ] CS-368 [P2] 理赔 PDF 收据
- [ ] CS-369 [P1] empty action 去投保
- [ ] CS-370 [P2] 理赔与 PolicyDetail 联动

---

## M. 钱包 WalletPage（CS-371 ~ CS-395）

- [ ] CS-371 [P1] 未连接 CTA
- [ ] CS-372 [P1] 未连接副标题 i18n（现硬编码 EN）
- [ ] CS-373 [P1] 余额 Anim 展示
- [ ] CS-374 [P1] 完整地址 copy
- [ ] CS-375 [P1] disconnect 按钮
- [ ] CS-376 [P1] txHistory 空 no_tx
- [ ] CS-377 [P1] tx connect/disconnect 类型
- [ ] CS-378 [P1] tx purchase/demo_purchase
- [ ] CS-379 [P1] tx claim/expire
- [ ] CS-380 [P1] tx wc_* 类型
- [ ] CS-381 [P1] 金额正负色
- [ ] CS-382 [P1] signature shortSig
- [ ] CS-383 [P2] tx 点击展开详情
- [ ] CS-384 [P2] tx filter 按类型
- [ ] CS-385 [P1] protocol/network/contract key 接入
- [ ] CS-386 [P2] 余额 chart 历史
- [ ] CS-387 [P2] 导出 tx CSV
- [ ] CS-388 [P1] 移动端地址换行
- [ ] CS-389 [P2] 多链 network 切换 placeholder
- [ ] CS-390 [P2] 硬件钱包 placeholder
- [ ] CS-391 [P1] loading connect 态
- [ ] CS-392 [P2] 余额不足 warning 条
- [ ] CS-393 [P1] Kelvin 余额内部一致
- [ ] CS-394 [P2] 钱包 avatar blockies
- [ ] CS-395 [P2] WalletConnect QR placeholder

---

## N. UI 组件库 ui.tsx（CS-396 ~ CS-430）

- [ ] CS-396 [P1] Button primary/secondary/danger/ghost
- [ ] CS-397 [P1] Button sm/md/lg 尺寸
- [ ] CS-398 [P1] Button disabled 态
- [ ] CS-399 [P1] Card default/highlight
- [ ] CS-400 [P2] Card glow 实现或删除 prop
- [ ] CS-401 [P1] Badge 6 变体对比度
- [ ] CS-402 [P1] SegmentedControl stretch/sm/md
- [ ] CS-403 [P1] SegmentedControl null 选中态
- [ ] CS-404 [P1] SearchInput focus 环
- [ ] CS-405 [P1] Empty icon/title/desc/action
- [ ] CS-406 [P1] Stat label/value/sub
- [ ] CS-407 [P1] Anim bigint 滚动
- [ ] CS-408 [P1] EthAmount 新组件
- [ ] CS-409 [P1] CopyButton 新组件
- [ ] CS-410 [P1] Toast 新组件
- [ ] CS-411 [P1] Modal 基础组件抽离
- [ ] CS-412 [P1] SectionTitle 组件
- [ ] CS-413 [P2] Skeleton 组件
- [ ] CS-414 [P2] Tooltip 组件
- [ ] CS-415 [P1] mono() helper 使用一致
- [ ] CS-416 [P1] 组件 focus-visible
- [ ] CS-417 [P2] 组件 dark/light 预留
- [ ] CS-418 [P1] 组件 TS props 严格类型
- [ ] CS-419 [P2] Storybook 每个组件
- [ ] CS-420 [P1] Button loading spinner
- [ ] CS-421 [P2] Card onClick 键盘
- [ ] CS-422 [P1] Badge uppercase 可读性
- [ ] CS-423 [P2] SegmentedControl 图标+文字
- [ ] CS-424 [P1] SearchInput aria-label
- [ ] CS-425 [P2] 组件 unit test
- [ ] CS-426 [P1] 组件文档注释
- [ ] CS-427 [P2] Dropdown 组件
- [ ] CS-428 [P2] Tabs 组件 generalized
- [ ] CS-429 [P1] 统一 borderRadius token
- [ ] CS-430 [P1] 统一 spacing token

---

## O. i18n 多语言（CS-431 ~ CS-470）

- [ ] CS-431 [P1] zh 全 key 完整性
- [ ] CS-432 [P1] en 全 key 完整性
- [ ] CS-433 [P1] ja 全 key 完整性
- [ ] CS-434 [P1] ko 全 key 完整性
- [ ] CS-435 [P1] ja/ko logistics/auto 缺失补全
- [ ] CS-436 [P1] 扫硬编码中文替换 $()
- [ ] CS-437 [P1] FLIGHTS weather condition i18n
- [ ] CS-438 [P1] SettleModal 副标题 i18n
- [ ] CS-439 [P1] Claims 航班/世界杯 label i18n
- [ ] CS-440 [P1] Wallet 副标题 i18n
- [ ] CS-441 [P1] WC 比分/ log i18n
- [ ] CS-442 [P1] footer_* 四语言（已完成，验）
- [ ] CS-443 [P1] policy_* 四语言（已完成，验）
- [ ] CS-444 [P2] npm run i18n:check 脚本
- [ ] CS-445 [P2] 未使用 key 清理报告
- [ ] CS-446 [P1] 参数 {count} {threshold} 一致性
- [ ] CS-447 [P2] 复数形式 en plural
- [ ] CS-448 [P1] 长文案德语预留
- [ ] CS-449 [P2] RTL 语言预留
- [ ] CS-450 [P1] LangContext 持久化 localStorage
- [ ] CS-451 [P1] getBrowserLanguage fallback en
- [ ] CS-452 [P2] 语言切换不丢表单 state
- [ ] CS-453 [P1] settle_* 步文案四语言等长 UI
- [ ] CS-454 [P2] 翻译贡献指南
- [ ] CS-455 [P1] worldcup_* wc_* 完整性
- [ ] CS-456 [P1] nft_* 完整性
- [ ] CS-457 [P3] 删除 product_logistics 等 dead key
- [ ] CS-458 [P1] demo_* 四语言
- [ ] CS-459 [P2] i18n JSON 拆分按模块
- [ ] CS-460 [P1] $() 缺失 key 控制台 warn dev
- [ ] CS-461 [P2] 专业术语表 glossary
- [ ] CS-462 [P1] ETH 单位各语言不翻译
- [ ] CS-463 [P2] 日期格式随 lang
- [ ] CS-464 [P1] 数字格式随 locale
- [ ] CS-465 [P2] 自动翻译 CI 检查
- [ ] CS-466 [P1] nav_* 四语言短标签 mobile
- [ ] CS-467 [P1] error 消息 i18n 化
- [ ] CS-468 [P2] tx 类型描述 i18n map
- [ ] CS-469 [P1] confirm_pay 参数 amount
- [ ] CS-470 [P2] 语言包 lazy load

---

## P. 常量 / 数据 / SDK（CS-471 ~ CS-490）

- [ ] CS-471 [P1] ethToKelvin 精度（已完成）
- [ ] CS-472 [P1] n() 小数格式（已完成）
- [ ] CS-473 [P1] DELAY_THRESHOLD 120 文档
- [ ] CS-474 [P1] MAX_POLICIES_PER_DAY 5 UI 一致
- [ ] CS-475 [P1] PROGRAM_ID 格式说明
- [ ] CS-476 [P1] FLIGHTS 数据 schema 类型
- [ ] CS-477 [P2] FLIGHTS 增量 API 接口设计
- [ ] CS-478 [P1] SDK connect 随机地址格式
- [ ] CS-479 [P1] SDK getBalance 10000 ETH
- [ ] CS-480 [P1] SDK purchasePolicy PDA
- [ ] CS-481 [P1] SDK settlePolicy claim PDA
- [ ] CS-482 [P2] SDK 接 @rialo/ts-cdk
- [ ] CS-483 [P2] SDK 接 @rialo/frost-core
- [ ] CS-484 [P2] getPoliciesByOwner 链上同步
- [ ] CS-485 [P1] randomSig 长度 64
- [ ] CS-486 [P2] PDA btoa → 真实 findProgramAddress
- [ ] CS-487 [P1] purchase 错误处理 throw
- [ ] CS-488 [P2] settle 错误 retry
- [ ] CS-489 [P1] SDK destroy cleanup
- [ ] CS-490 [P2] devnet/mainnet 切换 env

---

## Q. 样式 / 主题 / 工程化（CS-491 ~ CS-500）

- [ ] CS-491 [P1] tokens.ts 颜色对比 WCAG
- [ ] CS-492 [P1] index.css seg-btn hover（已完成）
- [ ] CS-493 [P1] index.css flight-item hover（已完成）
- [ ] CS-494 [P1] scrollbar 样式（已完成）
- [ ] CS-495 [P1] vite base /rialo-/ GitHub Pages
- [ ] CS-496 [P1] npm run deploy:pages 脚本
- [ ] CS-497 [P1] npm run build tsc 无错
- [ ] CS-498 [P2] vitest smoke 测试 3 条
- [ ] CS-499 [P2] GitHub Actions Pages workflow
- [ ] CS-500 [P1] README 评委 30 秒路径 + checklist 链接

---

## 附录：优先级统计

| 优先级 | 数量（约） |
|--------|-----------|
| P0 | 6 |
| P1 | ~320 |
| P2 | ~165 |
| P3 | ~9 |

## 附录：已完成可勾选

- [x] CS-056 SegmentedControl 航班筛选
- [x] CS-057 SearchInput
- [x] CS-106~109 TIERS ÷100
- [x] CS-124 订单 ETH 字号缩小
- [x] CS-252 PDA/TX 摘要
- [x] CS-260 PolicyDetailPanel
- [x] CS-274 settleTxSignature
- [x] CS-306~310 链上字段展示
- [x] CS-017~023 SiteFooter（部分，复制待 CS-017）
- [x] CS-044 寿险已移除；物流车险已移除
- [x] CS-211 NFT 三列
- [x] CS-495~497 部署构建

---

**文件路径：** `rialo-/OPTIMIZATION_CHECKLIST_500.md`  
**维护：** 完成一项改 `[x]`，可在末尾记录日期与 commit hash。
