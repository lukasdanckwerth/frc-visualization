
commands: $(eval .SILENT:)
	echo "targets:" && echo ""
	echo "  update           Checkout "$$"UPDATE_TAG (default master) and pull repository with submodules"
	echo "  upgrade          Checkout every submodules current master branch"
	echo ""

update:
	git pull --rebase origin dev
	git checkout dev

stage:
	git checkout stage
	git pull --rebase origin stage
	git merge dev
	git push origin stage
	git checkout dev
