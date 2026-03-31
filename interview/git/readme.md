# Git

## git pull 和 git fetch
- 分支 branch
  独立开发的时候，一个人一个默认主分支 版本的管理
  master/main 线上在运行的代码 ，正确的，不能乱改
  dev 分支  开发新功能 
  多人协作 每个人都会有自己的分支
  同一个文件多人开发，分支不会相互影响
  切换到相应的分支，合并内容
  改 bug 紧急
  git checkout -b fz-bug-fixed
  git merge branch_name
  feature 分支
  删除分支
  git diff

### git fetch
只拉取远程更新，安全又不影响当前分支，远程的 main，本地的origin/main
git diff main origin/main 远程改了哪些代码，本地缺哪些更新
git merge origin/main 
本地有自己的修改，不想立马合并
git 自己的分支在开发，还没有完工（bug）
立马有个bug 需要去修 1212909009
修改多个文件，不方便立马去提交到仓库
会出问题  dev 的修改会丢失，在退出当前分支前存档
git stash 111909099


### git pull
拉取远程更新，自动merge

### git merge 和 git rebase
接收代码的改变可以有两种选择
merge 合并 有缺点 会让提交历史变复杂，后期排查问题会很乱
rebase 变基 有优点 改变提交的基点，提交历史变成一条干净的时间线