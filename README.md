#工作区
	电脑看到的目录
#暂存区
	(.git/index) 索引
#版本库
	(.git)


###更新Git的版本
	git clone git://git.kernel.org/pub/scm/git/git.git
###文本编辑器修改
	git config --global core.editor emacs(文本编辑器的名称)
###克隆远程仓库并且自定义本地仓库的名称
	git clone http://git.oschina.net/yiibai/git-start.git mygit-start

#现有的远程库
https://github.com/Interestsoul/Gite-fitle.git
https://github.com/Interestsoul/STM32F103C8T6.git

#本地库创建Git
1. /创建文件,并且写入内容
	echo "# Gite-fitle" >> README.md
2. /初始化仓库
	git init
3. /添加,暂存目录树更新
	git add README.md
4. /提交,暂存区的目录树写到版本库中
	git commit --amend -m "first commit"
	git commit -a -m "？？mark"        /提交全部的文件，不需要 add
5. /
	git branch -M master
6. /关联远程库
	git remote add origin https://github.com/Interestsoul/Gite-fitle.git
7. /推送本地内容到远程库
	git push -u origin master

8. /查看当前工作区的文件状态
	git status
9. /查看修改
	git diff
	git diff --cached                /查看已经暂存起来的变化
10. /查看已经提交的修改
	git log                          /查看详细的日志
	git log --stat                   /查看简略的统计信息
	git log -p -2                    /查看最近的两次修改的内容差异
	git log --pretty=format:"%h %s" --graph
	git show                         /查看某一次提交详细信息
11. /更新远端库的最新信息
	git clone
	git pull
12. /隐藏
	git stash                        /隐藏这一次的修改内容
	git stash list                   /查看已存在更改的列表
	git stash pop                    /从堆栈中删除更改并将其放置在当前工作目录中
13. /移动文件/修改文件名称
	git mv README.md README
14. /删除文件
	git rm --cached <file>
15. /恢复文件
	git checkout -- <file>
16. /复位移动头指针
	git reset HEAD
	git reset HEAD --soft            /仅重置HEAD指针而不会破坏任何东西
	git reset - mixed
17. /创建标签
	git tag -a 'Release_1_0' -m 'Tagged basic string operation code' HEAD
	git push origin tag Release_1_0  /将标签推送到远程存储库
	git tag -l                       /查看所有可用的标签
	git show Release_1_0             /看有关标签的更多详细信息
	git tag -d Release_1_0           /删除标签
18. /补丁操作
	git format-patch
	git apply                        /应用补丁/修改本地文件而不创建提交
	git am                           /应用补丁/会修改文件并创建提交
19. /创建分支
	git branch <branch name>         /创建新的分支
	git branch                       /查看现有的分支
	git checkout <branch name>       /切换分支
	git checkout -b <branch name>    /创建分支并且切换过去
	git branch -D <branch name>      /删除分支
	git branch -m new_branch wchar_support /重命名分支
	git log origin/wchar_support -2  /查看分支的日志
	git merge origin/wchar_support   /合并两个分支
20. /Git不同平台换行符问题
	git config --global core.autocrlf true     /Windows系统
	git config --global core.autocrlf input    /GNU/Linux或Mac OS系统


### 获取远端服务器的最近的信息
git fetch origin

https://www.yiibai.com/git/git_config.html#article-start
