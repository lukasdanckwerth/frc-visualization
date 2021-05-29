
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
	git pull origin stage
	git merge dev
	git push origin stage
	git checkout dev

patch:
	npm version patch
	git push --follow-tags

production:
	git checkout main
	git pull origin stage
	git pull origin main
	git merge stage
	git push origin main
	git checkout dev
