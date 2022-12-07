#!/bin/bash

### ------------------------ FUNCTIONS -----------------------------------
function abort ()
{
	echo ""
	echo "# Install FAILED"
}

function step ()
{
	if [[ "$2" = "" ]]; then
		echo $1
	else
		echo -ne "$1[        ]\r"
		RES=`bash -c "$2"`
		if [[ $RES != "2" ]]; then
			echo "$1[   $(tput setaf 2)OK$(tput setaf 7)   ]"
		else
			echo "$1[ $(tput setaf 1)FAILED$(tput setaf 7) ]"
			echo "$RES"
			abort
			exit 2
		fi
	fi
}

### ------------------------ MAIN ------------------------------------
echo "$(tput setaf 2)# Ease FrontEnd Install$(tput setaf 7)"
echo ""

step " - Updating submodules ...				" 				"git submodule update --init --recursive --quiet"
step " - SetUp ...						" 						"npm install --quiet --silent"
step " - Husky Hooks Activation ...				" 				"npx husky install"
step " - Husky Commit Message Check ...			" 				"npx husky add .husky/commit-msg 'npx --no -- commitlint --edit \"$1\"'"
step " - Initialize the Conventional Changelog adapter ...	"	"npx commitizen init cz-conventional-changelog --save-dev --save-exact"

read -r -p "Switch to a new remote? [Y/n] " INPUT
case $INPUT in
	[yY][eE][sS]|[yY])
		read -r -p " - Insert repository remote: " REMOTE
		git remote set-url origin $REMOTE
		git push -u origin master
		;;
esac

echo ""
echo "$(tput setaf 2)# Ease FrontEnd Installed$(tput setaf 7)"