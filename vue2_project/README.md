## 修改element-ui的源码

```
node_modules\element-ui\lib\tree.js    1051行修改源码  去掉 'includeHalfChecked &&'
// if ((child.checked || includeHalfChecked && child.indeterminate) && (!leafOnly || leafOnly && child.isLeaf)) {
if ((child.checked || child.indeterminate) && (!leafOnly || leafOnly && child.isLeaf)) {
```