# X/Twitter 用户备注脚本：2026 兼容修复版

这是 [pana 原版脚本](https://greasyfork.org/zh-CN/scripts/404587-x-twitter-add-notes-to-the-user) 的非官方社区维护版本，用于修复 X/Twitter 更新页面结构后，备注无法在主页、引用帖和个人主页正常显示的问题。

> 本项目不会上传、收集或内置任何人的备注数据。备注仍由 Tampermonkey 保存在使用者自己的浏览器中。

## 安装

安装前需要浏览器已安装 [Tampermonkey](https://www.tampermonkey.net/)。

**[点击安装最新版](https://raw.githubusercontent.com/chasepal/x-twitter-user-notes-fix/main/x-twitter-user-notes-fixed.user.js)**

如果你没有使用过原版，打开上面的链接并在 Tampermonkey 安装页面确认安装即可。

## 从原版升级并保留旧备注

最稳妥的方式是原位更新，不要先删除旧脚本，也不要同时启用两个副本。

1. 打开 Tampermonkey 的「管理面板 → 实用工具」，导出一份备份。
2. 在「已安装脚本」中打开原来的 `X(Twitter) - 为用户添加备注(别名/标签)`。
3. 复制[最新版源代码](https://raw.githubusercontent.com/chasepal/x-twitter-user-notes-fix/main/x-twitter-user-notes-fixed.user.js)。
4. 回到原脚本编辑器，`Ctrl/Cmd + A` 全选替换，然后保存。
5. 确保只有这一份脚本启用，回到 X 后强制刷新页面。

修复版保留了原脚本的 `@name`、`@namespace` 和 Note_Obj 数据 ID，因此原位覆盖后会继续读取原来的 Tampermonkey 存储，无需手动搬运备注。

如果旧数据没有出现：

- 在 Tampermonkey 中打开脚本，检查「Storage/存储」标签是否仍有数据；
- 检查是否误装了两个脚本副本；
- 不要删除仍保存旧数据的脚本，必要时从备份恢复。

## 使用方法

- **个人主页：** 在“更多/关注”按钮附近点击蓝色编辑图标，添加、修改或删除备注。
- **悬浮用户卡片：** 鼠标停留在头像或用户名上，可在卡片中找到备注按钮。
- **主页时间线：** 已备注用户的别名/标签会显示在用户名旁边。
- **引用帖和 @提及：** 引用帖作者和正文中的账号提及也会显示对应备注。
- **推文工具栏按钮：** 可在脚本设置中选择是否在每条帖子下方显示备注按钮。
- **搜索与管理：** 使用页面上的备注搜索框或脚本管理界面查找已有备注。

## 本版修复内容

- 修复主页将显示名误识别成账号 ID 的问题；
- 适配新版帖子工具栏 DOM；
- 修复个人主页备注按钮，并与 X 原生操作按钮对齐；
- 支持新版无内部链接的引用帖结构；
- 修复关注列表、推荐用户、弹窗和悬浮用户卡片；
- 支持 X 虚拟列表节点复用，滚动加载后仍会重新应用备注；
- 保留原有搜索、设置、导入导出和 WebDAV 能力。

## 隐私与分享

仓库中只有脚本代码，不包含维护者或使用者的私人备注。请只分享 `.user.js` 安装链接，不要公开分享自己导出的备注 JSON、Tampermonkey 备份或 WebDAV 配置。

## 验证

当前版本已在 2026 年 8 月的 X 页面结构上验证，并覆盖：主页作者、引用帖、账号提及、个人主页、用户列表、悬浮卡片、工具栏开关和虚拟列表复用。

## 致谢与许可

- 原作者：[pana](https://greasyfork.org/zh-CN/users/193133-pana)
- 原脚本：[X(Twitter) - Add notes to the user](https://greasyfork.org/zh-CN/scripts/404587-x-twitter-add-notes-to-the-user)
- 2026 兼容维护：[chasepal](https://github.com/chasepal)

本项目按照 **GNU GPL v3.0 or later** 继续发布，详见 [LICENSE](./LICENSE)。

