---
title: "连锁反应"
date: "2023-12-11"
spoiler: "我语言的界限意味着我世界的界限。"
---

我在编辑器里写了一段 JSX：

```js
<p className="text-2xl font-sans text-purple-400 dark:text-purple-500">
    你好，<i>爱丽丝</i>！
</p>
```

现在，这些信息只存在于*我的*设备上。但如果运气好的话，它将穿越时间和空间到达*你的*设备，并显示在*你的*屏幕上。

```js eval
<p className="text-2xl font-sans text-purple-400 dark:text-purple-500">
    你好，<i>爱丽丝</i>！
</p>
```

这个事实本身就是一个工程奇迹。

在你的浏览器深处，有一些代码片段知道如何显示段落或绘制斜体文本。这些代码片段在不同的浏览器之间是不同的，甚至在同一浏览器的不同版本之间也是不同的。在不同的操作系统上，屏幕绘制的方式也不同。

然而，由于这些概念已经被赋予了约定的*名称*（段落用 [`<p>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/p)，斜体用 [`<i>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/i)），我可以引用它们，而无需担心它们在你的设备上*真正*是如何工作的。我无法直接访问它们的内部逻辑，但我知道我可以传递给它们哪些信息（例如 CSS 的 [`className`](https://developer.mozilla.org/en-US/docs/Web/API/Element/className)）。感谢 Web 标准，我可以相当肯定我的问候语会像我预期的那样显示出来。

像 `<p>` 和 `<i>` 这样的标签让我们能够引用内置的浏览器概念。然而，名称*不必*指代内置的东西。例如，我正在使用像 [`text-2xl`](https://tailwindcss.com/docs/font-size) 和 [`font-sans`](https://tailwindcss.com/docs/font-family) 这样的 CSS 类来设置我的问候语的样式。这些名称不是我自己想出来的——它们来自一个名为 Tailwind 的 CSS 库。我已将其包含在此页面上，这让我可以使用它定义的任何 CSS 类名。

那么，我们为什么喜欢给事物命名呢？

---

我写了 `<p>` 和 `<i>`，我的编辑器识别了这些名称。你的浏览器也一样。如果你做过一些 Web 开发，你可能也认识它们，甚至可能通过阅读标记猜到屏幕上会显示什么。从这个意义上说，名称帮助我们从一些共同的理解开始。

从根本上说，计算机执行相对基本类型的指令——比如加减乘除数字，向内存写入和从中读取数据，或者与显示器等外部设备通信。仅仅在你的屏幕上显示一个 `<p>` 就可能涉及运行数十万条这样的指令。

如果你看到你的电脑为了在屏幕上显示一个 `<p>` 而运行的所有指令，你几乎不可能猜到它们在做什么。这就像试图通过分析房间里所有原子弹跳来弄清楚正在播放哪首歌一样。这看起来简直难以理解！你需要“缩小”才能看清发生了什么。

为了描述一个复杂的系统，或者指示一个复杂的系统做什么，将它的行为分成相互依赖的概念层是有帮助的。

这样，屏幕驱动程序的开发人员可以专注于如何将正确的颜色发送到正确的像素。然后，文本渲染的开发人员可以专注于每个字符应该如何变成一堆像素。这使得像我这样的人可以专注于为我的“段落”和“斜体”选择合适的颜色。

我们喜欢名称，因为它们让我们忘记了名称背后的东西。

---

我使用了许多其他人想出来的名字。有些是浏览器内置的，比如 `<p>` 和 `<i>`。有些是我的工具内置的，比如 `text-2xl` 和 `font-sans`。这些可能是我的构建模块，但我*正在*构建什么呢？

例如，这是什么？

```js
<p className="text-2xl font-sans text-purple-400 dark:text-purple-500">
    你好，<i>爱丽丝</i>！
</p>
```

```js eval
<p className="text-2xl font-sans text-purple-400 dark:text-purple-500">
    你好，<i>爱丽丝</i>！
</p>
```

从你的浏览器的角度来看，这是一个带有特定 CSS 类（使其变大并呈现紫色）的段落，里面包含一些文本（其中一部分是斜体）。

但从*我的*角度来看，这是*给爱丽丝的问候语*。虽然我的问候语*恰好*是一个段落，但大多数时候我想这样思考它：

```js
<Greeting person={alice} />
```

给这个概念命名为我提供了一些新的灵活性。我现在可以显示多个 `Greeting`，而无需复制和粘贴它们的标记。我可以向它们传递不同的数据。如果我想改变所有问候语的外观和行为，我可以在一个地方完成。将 `Greeting` 变成它自己的概念让我可以将“_显示哪些问候语_”与“_什么是问候语_”分开调整。

然而，我也引入了一个问题。

既然我已经给这个概念命名了，我脑海中的“语言”就与你的浏览器所说的“语言”不同了。你的浏览器知道 `<p>` 和 `<i>`，但它从未听说过 `<Greeting>`——那是我自己的概念。如果我想让你的浏览器理解我的意思，我必须将这段标记“翻译”成只使用你的浏览器已经知道的概念。

我需要将这个：

```js
<Greeting person={alice} />
```

变成这个：

```js
<p className="text-2xl font-sans text-purple-400 dark:text-purple-500">
    你好，<i>爱丽丝</i>！
</p>
```

我该怎么做呢？

---

要命名某事物，我需要定义它。

例如，在我定义 `alice` 之前，`alice` 没有任何意义：

```js
const alice = {
  firstName: "Alice",
  birthYear: 1970,
};
```

现在 `alice` 指的是那个 JavaScript 对象。

类似地，我需要真正*定义*我的 `Greeting` 概念意味着什么。

我将为任何 `person` 定义一个 `Greeting`，它是一个段落，显示“你好，”后面跟着*那个*人的名字（斜体），再加上一个感叹号：

```js
function Greeting({ person }) {
  return (
    <p className="text-2xl font-sans text-purple-400 dark:text-purple-500">
            你好，<i>{person.firstName}</i>！    {" "}
    </p>
  );
}
```

与 `alice` 不同，我将 `Greeting` 定义为一个函数。这是因为*一个问候语*对于每个人来说都必须是不同的。`Greeting` 是一段代码——它执行一个*转换*或一个*翻译*。它*将*一些数据*变成*一些 UI。

这让我对如何处理这个有了想法：

```js
<Greeting person={alice} />
```

你的浏览器不知道 `Greeting` 是什么——那是我自己的概念。但是现在我为这个概念编写了一个定义，我可以*应用*这个定义来“解包”我的意思。你看，_一个给某人的问候语实际上是一个段落：_

```js {3-5}
function Greeting({ person }) {
  return (
    <p className="text-2xl font-sans text-purple-400 dark:text-purple-500">
            你好，<i>{person.firstName}</i>！    {" "}
    </p>
  );
}
```

将 `alice` 的数据插入到该定义中，我最终得到了这个最终的 JSX：

```js
<p className="text-2xl font-sans text-purple-400 dark:text-purple-500">
    你好，<i>爱丽丝</i>！
</p>
```

在这一点上，我只引用了浏览器自己的概念。通过用我定义的内容替换 `Greeting`，我已经为你的浏览器“翻译”了它。

```js eval
function Greeting({ person }) {
  return (
    <p className="text-2xl font-sans text-purple-400 dark:text-purple-500">
            你好，<i>{person.firstName}</i>！    {" "}
    </p>
  );
}

const alice = {
  firstName: "Alice",
  birthYear: 1970,
};

<Greeting person={alice} />;
```

现在让我们教计算机做同样的事情。

---

看看 JSX 是由什么构成的。

```js
const originalJSX = <Greeting person={alice} />;
console.log(originalJSX.type); // Greeting
console.log(originalJSX.props); // { person: { firstName: 'Alice', birthYear: 1970 } }
```

在底层，JSX 构建一个对象，其 `type` 属性对应于标签，`props` 属性对应于 JSX 属性。

你可以将 `type` 看作是“代码”，将 `props` 看作是“数据”。要获得结果，你需要像我之前所做的那样，将该数据插入到该代码中。

这是我编写的一个小函数，它完全做到了这一点：

```js
function translateForBrowser(originalJSX) {
  const { type, props } = originalJSX;
  return type(props);
}
```

在这种情况下，`type` 将是 `Greeting`，`props` 将是 `{ person: alice }`，因此 `translateForBrowser(<Greeting person={alice} />)` 将返回使用 `{ person: alice }` 作为参数调用 `Greeting` 的结果。

正如你可能从上一节回忆起的那样，这将给我带来：

```js
<p className="text-2xl font-sans text-purple-400 dark:text-purple-500">
    你好，<i>爱丽丝</i>！
</p>
```

这正是我想要的！

你可以验证一下，将我最初的 JSX 代码片段提供给 `translateForBrowser` 将会生成只引用 `<p>` 和 `<i>` 等概念的“浏览器 JSX”。

```js {5-7}
const originalJSX = <Greeting person={alice} />;
console.log(originalJSX.type); // Greeting
console.log(originalJSX.props); // { person: { firstName: 'Alice', birthYear: 1970 } }

const browserJSX = translateForBrowser(originalJSX);
console.log(browserJSX.type); // 'p'
console.log(browserJSX.props); // { className: 'text-2xl font-sans text-purple-400 dark:text-purple-500', children: ['Hello', { type: 'i', props: { children: 'Alice' } }, '!'] }
```

对于那个“浏览器 JSX”，我可以做很多事情。例如，我可以将其转换为 HTML 字符串发送给浏览器。我也可以将其转换为更新现有 DOM 节点的指令序列。目前，我不会关注使用它的不同方式。现在重要的是，当我拥有“浏览器 JSX”时，就没有什么需要“翻译”的了。

这就像我的 `<Greeting>` 溶解了，剩下的只有 `<p>` 和 `<i>`。

---

让我们尝试稍微复杂一点的东西。假设我想将我的问候语包裹在一个 [`<details>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details) 标签中，使其默认处于折叠状态：

```js {1,3}
<details>
    <Greeting person={alice} />
</details>
```

浏览器应该像这样显示它（点击“Details”展开它！）

```js eval
function Greeting({ person }) {
  return (
    <p className="text-2xl font-sans text-purple-400 dark:text-purple-500">
            你好，<i>{person.firstName}</i>！    {" "}
    </p>
  );
}

const alice = {
  firstName: "Alice",
  birthYear: 1970,
};

<details className="pb-8">
    <Greeting person={alice} />
</details>;
```

所以现在我的任务是弄清楚如何将这个：

```js
<details>
    <Greeting person={alice} />
</details>
```

变成这个：

```js
<details>
   {" "}
  <p className="text-2xl font-sans text-purple-400 dark:text-purple-500">
        你好，<i>爱丽丝</i>！  {" "}
  </p>
</details>
```

让我们看看 `translateForBrowser` 是否已经可以处理这个问题。

```js {2-4,9}
const originalJSX = (
  <details>
        <Greeting person={alice} /> {" "}
  </details>
);
console.log(originalJSX.type); // 'details'
console.log(originalJSX.props); // { children: { type: Greeting, props: { person: alice } } }

const browserJSX = translateForBrowser(originalJSX);
```

你会在 `translateForBrowser` 调用中得到一个错误：

```js {3}
function translateForBrowser(originalJSX) {
  const { type, props } = originalJSX;
  return type(props); // 🔴 TypeError: type is not a function
}
```

这里发生了什么？我的 `translateForBrowser` 实现假设 `type`——也就是 `originalJSX.type`——始终是一个像 `Greeting` 这样的函数。

然而，请注意，这次 `originalJSX.type` 实际上是一个*字符串*：

```js {6}
const originalJSX = (
  <details>
        <Greeting person={alice} /> {" "}
  </details>
);
console.log(originalJSX.type); // 'details'
console.log(originalJSX.props); // { children: { type: Greeting, props: { person: alice } } }
```

当你用小写字母开头一个 JSX 标签（比如 `<details>`）时，按照惯例，人们会认为你*想要*一个内置标签，而不是你定义的某个函数。

由于内置标签没有任何相关的代码（这些代码在你的浏览器内部的某个地方！），`type` 将会是一个像 `'details'` 这样的字符串。`<details>` 的工作方式对我的代码来说是不透明的——我真正知道的只有它的名字。

让我们将逻辑分成两种情况，并且暂时跳过翻译内置标签：

```js {3,5-7}
function translateForBrowser(originalJSX) {
  const { type, props } = originalJSX;
  if (typeof type === "function") {
    return type(props);
  } else if (typeof type === "string") {
    return originalJSX;
  }
}
```

经过此更改后，`translateForBrowser` 将只尝试调用某个函数，如果原始 JSX 的 `type` 实际上*是*一个像 `Greeting` 这样的函数。

所以这就是我想要的结果，对吧？...

```js
<details>
    <Greeting person={alice} />
</details>
```

等等。我想要的是这个：

```js
<details>
   {" "}
  <p className="text-2xl font-sans text-purple-400 dark:text-purple-500">
        你好，<i>爱丽丝</i>！  {" "}
  </p>
</details>
```

在我的翻译过程中，我想*跳过* `<details>` 标签，因为它的实现对我来说是不透明的。我无法用它做任何有用的事情——这完全取决于浏览器。然而，它*内部*的任何东西仍然可能需要翻译！

让我们修复 `translateForBrowser` 以翻译任何内置标签的子元素：

```js {6-12}
function translateForBrowser(originalJSX) {
  const { type, props } = originalJSX;
  if (typeof type === "function") {
    return type(props);
  } else if (typeof type === "string") {
    return {
      type,
      props: {
        ...props,
        children: translateForBrowser(props.children),
      },
    };
  }
}
```

通过此更改，当它遇到像 `<details>...</details>` 这样的元素时，它将返回另一个 `<details>...</details>` 标签，但它*内部*的内容将再次通过我的函数进行翻译——因此 `Greeting` 将会消失：

```js
<details>
   {" "}
  <p className="text-2xl font-sans text-purple-400 dark:text-purple-500">
        你好，<i>爱丽丝</i>！  {" "}
  </p>
</details>
```

而*现在*我又在使用浏览器的“语言”了：

```js eval
<details className="pb-8">
   {" "}
  <p className="text-2xl font-sans text-purple-400 dark:text-purple-500">
        你好，<i>爱丽丝</i>！  {" "}
  </p>
</details>
```

`Greeting` 已经溶解了。

---

现在假设我尝试定义一个 `ExpandableGreeting`：

```js
function ExpandableGreeting({ person }) {
  return (
    <details>
            <Greeting person={person} />   {" "}
    </details>
  );
}
```

这是我的新的原始 JSX：

```js
<ExpandableGreeting person={alice} />
```

如果我通过 `translateForBrowser` 运行它，我将得到这个 JSX 作为返回值：

```js
<details>
    <Greeting person={alice} />
</details>
```

但这并不是我想要的！它仍然包含一个 `Greeting`，并且在我们自己的所有概念都消失之前，我们不会认为一段 JSX 是“浏览器就绪”的。

这是我的 `translateForBrowser` 函数中的一个错误。当它调用像 `ExpandableGreeting` 这样的函数时，它将返回其输出，而不会执行任何其他操作。但我们需要继续前进！返回的 JSX *也*需要被翻译。

幸运的是，我有一个简单的方法可以解决这个问题。当我调用像 `ExpandableGreeting` 这样的函数时，我可以获取它返回的 JSX 并接下来翻译*它*：

```js {4-5}
function translateForBrowser(originalJSX) {
  const { type, props } = originalJSX;
  if (typeof type === "function") {
    const returnedJSX = type(props);
    return translateForBrowser(returnedJSX);
  } else if (typeof type === "string") {
    return {
      type,
      props: {
        ...props,
        children: translateForBrowser(props.children),
      },
    };
  }
}
```

当没有任何需要翻译的内容时，比如接收到 `null` 或字符串时，我也需要停止该过程。如果它接收到一个事物数组，我需要翻译其中的每一个。通过这两个修复，`translateForBrowser` 就完成了：

```js {2-7}
function translateForBrowser(originalJSX) {
  if (originalJSX == null || typeof originalJSX !== "object") {
    return originalJSX;
  }
  if (Array.isArray(originalJSX)) {
    return originalJSX.map(translateForBrowser);
  }
  const { type, props } = originalJSX;
  if (typeof type === "function") {
    const returnedJSX = type(props);
    return translateForBrowser(returnedJSX);
  } else if (typeof type === "string") {
    return {
      type,
      props: {
        ...props,
        children: translateForBrowser(props.children),
      },
    };
  }
}
```

现在，假设我从这个开始：

```js
<ExpandableGreeting person={alice} />
```

它将变成这个：

```js
<details>
    <Greeting person={alice} />
</details>
```

这将变成这个：

```js
<details>
   {" "}
  <p className="text-2xl font-sans text-purple-400 dark:text-purple-500">
        你好，<i>爱丽丝</i>！  {" "}
  </p>
</details>
```

到那时，这个过程就会停止。

---

让我们再看一遍它是如何工作的，这次稍微深入一点。

我将像这样定义 `WelcomePage`：

```js
function WelcomePage() {
  return (
    <section>
            <h1 className="text-3xl font-sans pb-2">欢迎</h1>
            <ExpandableGreeting person={alice} />
            <ExpandableGreeting person={bob} />
            <ExpandableGreeting person={crystal} />   {" "}
    </section>
  );
}
```

现在假设我从这个原始 JSX 开始这个过程：

```js
<WelcomePage />
```

你能在脑海中回溯一下转换序列吗？

让我们一步一步地一起做。

首先，想象一下 `WelcomePage` 溶解，留下它的输出：

```js {1-6}
<section>
    <h1 className="text-3xl font-sans pb-2">欢迎</h1>
    <ExpandableGreeting person={alice} />
    <ExpandableGreeting person={bob} />
    <ExpandableGreeting person={crystal} />
</section>
```

然后想象一下每个 `ExpandableGreeting` 溶解，留下它*自己*的输出：

```js {3-11}
<section>
    <h1 className="text-3xl font-sans pb-2">欢迎</h1> {" "}
  <details>
        <Greeting person={alice} /> {" "}
  </details>
   {" "}
  <details>
        <Greeting person={bob} /> {" "}
  </details>
    <details>
        <Greeting person={crystal} /> {" "}
  </details>
</section>
```

然后想象一下每个 `Greeting` 溶解，留下它*自己*的输出：

```js {4-6,9-11,14-16}
<section>
    <h1 className="text-3xl font-sans pb-2">欢迎</h1> {" "}
  <details>
       {" "}
    <p className="text-2xl font-sans text-purple-400 dark:text-purple-500">
            你好，<i>爱丽丝</i>！    {" "}
    </p>
     {" "}
  </details>
   {" "}
  <details>
       {" "}
    <p className="text-2xl font-sans text-purple-400 dark:text-purple-500">
            你好，<i>鲍勃</i>！    {" "}
    </p>
     {" "}
  </details>
    <details>
       {" "}
    <p className="text-2xl font-sans text-purple-400 dark:text-purple-500">
            你好，<i>克里斯托</i>！    {" "}
    </p>
     {" "}
  </details>
</section>
```

而现在，没有什么需要“翻译”的了。所有*我的*概念都已溶解。

```js eval
<section className="pb-8">
    <h1 className="text-3xl font-sans pb-2">欢迎</h1> {" "}
  <details>
       {" "}
    <p className="text-2xl font-sans text-purple-400 dark:text-purple-500">
            你好，<i>爱丽丝</i>！    {" "}
    </p>
     {" "}
  </details>
   {" "}
  <details>
       {" "}
    <p className="text-2xl font-sans text-purple-400 dark:text-purple-500">
            你好，<i>鲍勃</i>！    {" "}
    </p>
     {" "}
  </details>
    <details>
       {" "}
    <p className="text-2xl font-sans text-purple-400 dark:text-purple-500">
            你好，<i>克里斯托</i>！    {" "}
    </p>
     {" "}
  </details>
</section>
```

这感觉像一个连锁反应。你混合了一些数据和代码，它会不断转换，直到没有更多的代码可以运行，只剩下残余。

如果有一个库可以为我们做这件事，那就太好了。

但是等等，这里有一个问题。这些转换必须发生在你的电脑和我的电脑之间的*某个地方*。那么它们*发生*在哪里呢？

它们发生在你的电脑上吗？

还是发生在我的电脑上？

```

```

```

```
