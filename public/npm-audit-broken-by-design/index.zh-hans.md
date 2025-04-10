---
title: "npm audit：设计上的缺陷"
date: "2021-07-07"
spoiler: "发现99个漏洞（84个中度无关，15个高度无关）"
---

安全性很重要。没有人想成为那个提倡减少安全性的人。所以没有人愿意说出来。但总得有人说出来。

那么我想我来说吧。

**`npm audit`的工作方式存在缺陷。它在每次`npm install`后作为默认功能的推出是仓促的、不体贴的，而且对前端工具来说是不够的。**

你听过[狼来了的故事](https://en.wikipedia.org/wiki/The_Boy_Who_Cried_Wolf)吗？剧透警告：狼最终吃掉了羊。如果我们不想让羊被吃掉，我们需要更好的工具。

截至今天，`npm audit`是整个 npm 生态系统的污点。修复它的最佳时机是在将其作为默认功能推出之前。下一个最佳时机就是现在。

在这篇文章中，我将简要概述它是如何工作的，为什么它存在缺陷，以及我希望看到的变化。

---

_注：本文以批判性和有些讽刺的语气撰写。我理解维护像 Node.js/npm 这样的大型项目是非常困难的，而且错误可能需要一段时间才能显现出来。我只是对这种情况感到沮丧，而不是对相关人员。我保留讽刺的语气，因为多年来我的沮丧程度一直在增加，我不想假装情况没有像实际那样糟糕。最让我沮丧的是看到所有那些把这作为第一次编程经验的人，以及所有那些因为无关警告而被阻止部署其更改的人。我很高兴[这个问题正在被考虑](https://twitter.com/bitandbang/status/1412803378279759872)，我将尽我所能为提出的解决方案提供意见！💜_

---

## npm audit 是如何工作的？

_如果你已经知道它是如何工作的，可以[跳到前面](#why-is-npm-audit-broken)。_

你的 Node.js 应用程序有一个依赖树。它可能看起来像这样：

```
your-app
  - view-library@1.0.0
  - design-system@1.0.0
  - model-layer@1.0.0
    - database-layer@1.0.0
      - network-utility@1.0.0
```

很可能，它要深得多。

现在假设在`network-utility@1.0.0`中发现了一个漏洞：

```
your-app
  - view-library@1.0.0
  - design-system@1.0.0
  - model-layer@1.0.0
    - database-layer@1.0.0
      - network-utility@1.0.0（存在漏洞！）
```

这会被发布在一个特殊的注册表中，下次你运行`npm audit`时，`npm`会访问该注册表。从 npm v6+开始，每次`npm install`后你都会看到这个信息：

```
1 vulnerabilities (0 moderate, 1 high)

To address issues that do not require attention, run:
  npm audit fix

To address all issues (including breaking changes), run:
  npm audit fix --force
```

你运行`npm audit fix`，npm 尝试安装带有修复程序的最新`network-utility@1.0.1`。只要`database-layer`指定它依赖的不是*精确的*`network-utility@1.0.0`，而是包含`1.0.1`的某个允许范围，修复就"正常工作"，你得到一个正常工作的应用程序：

```
your-app
  - view-library@1.0.0
  - design-system@1.0.0
  - model-layer@1.0.0
    - database-layer@1.0.0
      - network-utility@1.0.1（已修复！）
```

另一方面，也许`database-layer@1.0.0`严格依赖于`network-utility@1.0.0`。在这种情况下，`database-layer`的维护者需要发布一个新版本，允许使用`network-utility@1.0.1`：

```
your-app
  - view-library@1.0.0
  - design-system@1.0.0
  - model-layer@1.0.0
    - database-layer@1.0.1（更新以允许修复。）
      - network-utility@1.0.1（已修复！）
```

最后，如果没有办法优雅地升级依赖树，你可以尝试`npm audit fix --force`。这应该在`database-layer`不接受新版本的`network-utility`并且也没有发布更新以接受它的情况下使用。所以你有点在自己掌控事情，可能冒着破坏性变更的风险。这似乎是一个合理的选择。

**这就是`npm audit`理论上应该工作的方式。**

正如一位智者所说，理论上理论和实践之间没有区别。但在实践中是有区别的。这就是所有有趣的地方开始的地方。

## 为什么 npm audit 存在缺陷？

让我们看看它在实践中是如何工作的。我将使用 Create React App 进行测试。

如果你不熟悉它，它是一个集成门面，结合了多个其他工具，包括 Babel、webpack、TypeScript、ESLint、PostCSS、Terser 等。Create React App 接收你的 JavaScript 源代码并将其转换为静态 HTML+JS+CSS 文件夹。**值得注意的是，它*不*生成 Node.js 应用程序。**

让我们创建一个新项目！

```
npx create-react-app myapp
```

在创建项目之后，我立即看到了这个：

```
found 5 vulnerabilities (3 moderate, 2 high)
  run `npm audit fix` to fix them, or `npm audit` for details
```

哦不，看起来很糟糕！我刚创建的应用程序已经存在漏洞！

至少 npm 是这么告诉我的。

让我们运行`npm audit`看看是什么情况。

### 第一个"漏洞"

这是`npm audit`报告的第一个问题：

```
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ Moderate      │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ browserslist                                                 │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=4.16.5                                                     │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ react-scripts                                                │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ react-scripts > react-dev-utils > browserslist               │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://npmjs.com/advisories/1747                            │
└───────────────┴──────────────────────────────────────────────────────────────┘
```

显然，`browserslist`存在漏洞。这是什么以及它是如何使用的？Create React App 为你所针对的浏览器生成优化的 CSS 文件。例如，你可以在`package.json`中说你只针对现代浏览器：

```jsx
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
```

然后它不会在输出中包含过时的 flexbox 黑客。由于多个工具依赖于相同的配置格式来确定你所针对的浏览器，Create React App 使用共享的`browserslist`包来解析配置文件。

那么这里的漏洞是什么？["正则表达式拒绝服务"](https://owasp.org/www-community/attacks/Regular_expression_Denial_of_Service_-_ReDoS)意味着`browserslist`中有一个正则表达式，在恶意输入下可能会变得非常慢。所以攻击者可以制作一个特殊的配置字符串，当传递给`browserslist`时，可能会使其指数级变慢。这听起来很糟糕......

等等，什么？！让我们记住你的应用程序是如何工作的。你在*你的机器*上有一个配置文件。你*构建*你的项目。你在一个文件夹中得到静态的 HTML+CSS+JS。你把它放在静态托管上。你的应用程序用户**没有办法**影响你的`package.json`配置。**这根本没有任何意义。**如果攻击者已经访问了你的机器并可以更改你的配置文件，那么你有一个比正则表达式慢更大的问题！

好的，所以我猜这个"中等"的"漏洞"在项目上下文中既不是中等也不是漏洞。让我们继续。

**结论：这个"漏洞"在这个上下文中是荒谬的。**

### 第二个"漏洞"

这是`npm audit`有帮助地报告的下一个问题：

```
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ Moderate      │ Regular expression denial of service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ glob-parent                                                  │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=5.1.2                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ react-scripts                                                │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ react-scripts > webpack-dev-server > chokidar > glob-parent  │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://npmjs.com/advisories/1751                            │
└───────────────┴──────────────────────────────────────────────────────────────┘
```

让我们看看`webpack-dev-server > chokidar > glob-parent`依赖链。这里，`webpack-dev-server`是一个**仅用于开发**的服务器，用于在**本地**快速提供你的应用程序。它使用`chokidar`来监视你的文件系统变化（例如当你在编辑器中保存文件时）。它使用[`glob-parent`](https://www.npmjs.com/package/glob-parent)从文件系统监视模式中提取文件系统路径的一部分。

不幸的是，`glob-parent`存在漏洞！如果攻击者提供一个特别制作的文件路径，它可能会使这个函数指数级变慢，这将......

等等，什么？！开发服务器在你的计算机上。文件在你的计算机上。文件监视器使用的是*你*指定的配置。这些逻辑没有离开你的计算机。如果攻击者足够复杂到可以在本地开发期间登录*你的机器*，他们最不想做的就是制作特殊的长文件路径来减慢你的开发速度。他们会想要窃取你的秘密。**所以这整个威胁是荒谬的。**

看起来这个"中等"的"漏洞"在项目上下文中既不是中等也不是漏洞。

**结论：这个"漏洞"在这个上下文中是荒谬的。**

### 第三个"漏洞"

让我们看看这个：

```
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ Moderate      │ Regular expression denial of service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ glob-parent                                                  │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=5.1.2                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ react-scripts                                                │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ react-scripts > webpack > watchpack > watchpack-chokidar2 >  │
│               │ chokidar > glob-parent                                       │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://npmjs.com/advisories/1751                            │
└───────────────┴──────────────────────────────────────────────────────────────┘
```

等等，这和上面的是同一个东西，只是通过不同的依赖路径。

**结论：这个"漏洞"在这个上下文中是荒谬的。**

### 第四个"漏洞"

哦，这个看起来真的很糟糕！**`npm audit`竟然用红色显示它：**

```
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ High          │ Denial of Service                                            │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ css-what                                                     │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=5.0.1                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ react-scripts                                                │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ react-scripts > @svgr/webpack > @svgr/plugin-svgo > svgo >   │
│               │ css-select > css-what                                        │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://npmjs.com/advisories/1754                            │
└───────────────┴──────────────────────────────────────────────────────────────┘
```

这个"高"严重性问题是什么？"拒绝服务"。我不希望服务被拒绝！那将是非常糟糕的......除非......

让我们看看[问题](https://www.npmjs.com/advisories/1754)。显然[`css-what`](https://www.npmjs.com/package/css-what)，这是一个 CSS 选择器的解析器，对于特别制作的输入可能会变慢。这个解析器被一个从 SVG 文件生成 React 组件的插件使用。

所以这意味着如果攻击者控制了我的开发机器或者我的源代码，他们放入了一个特殊的 SVG 文件，其中包含一个特别制作的 CSS 选择器，这将使我的构建变慢。这说得通......

等等，什么？！如果攻击者可以修改我的应用程序的源代码，他们可能只会在其中放入比特币矿工。除非你可以用 SVG 挖比特币，否则他们为什么要向我的应用程序添加 SVG 文件？再次，这根本没有*任何*意义。

**结论：这个"漏洞"在这个上下文中是荒谬的。**

所谓的"高"严重性也就这样。

### 第五个"漏洞"

```
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ High          │ Denial of Service                                            │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ css-what                                                     │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=5.0.1                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ react-scripts                                                │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ react-scripts > optimize-css-assets-webpack-plugin > cssnano │
│               │ > cssnano-preset-default > postcss-svgo > svgo > css-select  │
│               │ > css-what                                                   │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://npmjs.com/advisories/1754                            │

└───────────────┴──────────────────────────────────────────────────────────────┘
```

这只是与上面相同的东西。

**结论：这个"漏洞"在这个上下文中是荒谬的。**

### 我们要继续吗？

到目前为止，这个孩子已经喊了五次狼来了。其中两个是重复的。其余的在这些依赖项的使用上下文中是荒谬的非问题。

五个错误警报还不是太糟糕。

**不幸的是，有数百个。**

这里有几个[典型](https://github.com/facebook/create-react-app/issues/11053)[的](https://github.com/facebook/create-react-app/issues/11092)主题，但还有更多[从这里链接](https://github.com/facebook/create-react-app/issues/11174)：

<img src="https://imgur.com/ABDK4Ky.png" alt="许多GitHub主题的截图" />

**我花了几个小时查看过去几个月向我们报告的每一个`npm audit`问题，在像 Create React App 这样的构建工具依赖的上下文中，它们都似乎是误报。**

当然，它们是可以修复的。我们可以放宽一些顶级依赖项的要求，使其不那么精确（导致补丁中的 bug 更容易溜进来）。我们可以进行更多的发布，只是为了跟上这种安全剧场。

但这是不够的。想象一下，如果你的测试有 99%的时间因为假原因而失败！这浪费了数十年的人力，让每个人都感到痛苦：

- **它让初学者感到痛苦**，因为他们在 Node.js 生态系统中第一次编程体验中就遇到了这个问题。好像安装 Node.js/npm 还不够混乱（如果你根据教程加了`sudo`，祝你好运），当他们尝试在线示例或者甚至创建一个项目时，这就是他们看到的。初学者不知道正则表达式*是*什么。当然，他们没有能够判断当他们使用构建工具生产静态 HTML+CSS+JS 站点时，正则表达式 DDoS 或原型污染是否是需要担心的事情的专业知识。
- **它让有经验的应用程序开发人员感到痛苦**，因为他们要么浪费时间做明显不必要的工作，要么与他们的安全部门斗争，试图解释`npm audit`是一个*设计上*就不适合真正安全审计的破工具。是的，不知何故它在这种状态下被作为默认选项了。
- **它让维护者感到痛苦**，因为他们不是修复 bug 和改进，而是不得不引入不可能影响他们项目的假漏洞修复，因为否则他们的用户会感到沮丧、害怕或两者兼而有之。
- **有一天，它会让我们的用户感到痛苦**，因为我们已经训练了整整一代开发人员，要么由于被大量信息淹没而不理解警告，要么因为它们总是出现但有经验的开发人员（正确地）告诉他们每种情况下都没有真正的问题而*忽略*它们。

`npm audit fix`（工具建议使用的）存在 bug，这也没有帮助。我今天运行了`npm audit fix --force`，它**降级**了主要依赖项到一个三年前的版本，其中包含实际上*真实*的漏洞。谢谢，npm，干得好。

## 接下来是什么？

我不知道如何解决这个问题。但我首先没有添加这个系统，所以我可能不是解决它的最佳人选。我只知道它非常糟糕。

我看到了几个可能的解决方案。

- **如果依赖项在生产中不运行，将其移至`devDependencies`。** 这提供了一种方式来指定某些依赖项不在生产代码路径中使用，因此与之相关的风险不存在。然而，这个解决方案有缺陷：
  - `npm audit`默认仍然会对开发依赖项发出警告。你必须*知道*运行`npm audit --production`才能不看到来自开发依赖项的警告。知道要这样做的人可能已经不再信任它了。这也不能帮助初学者或在公司工作的人，他们的安全部门想要审计所有内容。
  - `npm install`仍然使用普通`npm audit`的信息，所以每次安装东西时，你实际上仍然会看到所有的误报。
  - 正如任何安全专业人士会告诉你的那样，开发依赖项实际上*是*一个攻击载体，也许是最危险的一个，因为它很难检测，而且代码运行时具有高信任假设。**这就是为什么情况如此糟糕的特殊原因：任何真正的问题都被`npm audit`训练人们和维护者忽略的几十个非问题埋没了。**这只是时间问题。
- **在发布时内联所有依赖项。** 这是我越来越多地看到类似 Create React App 的包所做的事情。例如，[Vite](https://unpkg.com/browse/vite@2.4.1/dist/node/)和[Next.js](https://unpkg.com/browse/next@11.0.1/dist/)都简单地将它们的依赖项直接捆绑在包中，而不是依赖 npm 的`node_modules`机制。从维护者的角度来看，[好处很明显](https://github.com/vitejs/vite/blob/main/.github/contributing.md#notes-on-dependencies)：你得到更快的启动时间，更小的下载，以及 — 作为一个很好的额外好处 — 没有来自用户的虚假漏洞报告。这是一种巧妙的方式来玩弄系统，但我担心 npm 为生态系统创造的激励。内联依赖项在某种程度上违背了 npm 的全部意义。
- **提供某种方式来反驳漏洞报告。** 这个问题对 Node.js 和 npm 来说并不完全未知。不同的人已经在不同的建议上工作以解决它。例如，有一个[提议](https://github.com/npm/rfcs/pull/18)，可以手动解决审计警告，使其不再显示。然而，这仍然把负担放在应用程序用户身上，他们不一定有上下文来判断深层依赖树中的漏洞是真实的还是虚假的。我也有一个[提议](https://twitter.com/dan_abramov/status/1412380714012594178)：我需要一种方式来向我的用户标记某个漏洞不可能影响他们。如果你不信任我的判断，为什么你要在你的计算机上运行我的代码？我很乐意讨论其他选择。

问题的根源是 npm 添加了一个默认行为，在许多情况下，导致 99%以上的误报率，创造了令人难以置信的混乱的第一次编程体验，使人们与安全部门斗争，使维护者永远不想再处理 Node.js 生态系统，并且在某个时候将导致实际上糟糕的漏洞不被注意地溜进来。

必须采取行动。

同时，我计划关闭所有我看到的来自`npm audit`的 GitHub 问题，这些问题不对应于*真正*可能影响项目的漏洞。我邀请其他维护者采用相同的政策。这将为我们的用户创造沮丧，但问题的核心在于 npm。我受够了这种安全剧场。Node.js/npm 有权力解决问题。我正在与他们联系，我希望看到这个问题被优先处理。

今天，`npm audit`设计上就有缺陷。

初学者、有经验的开发人员、维护者、安全部门以及最重要的 — 我们的用户 — 都值得更好的体验。
