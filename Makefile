
commands: $(eval .SILENT:)
	echo "targets:" && echo ""
	echo "  update           Checkout "$$"UPDATE_TAG (default master) and pull repository with submodules"
	echo "  upgrade          Checkout every submodules current master branch"
	echo ""

update:
	# grab the latest from origin/main
	git pull --rebase origin main

	# create your feature branch
	git checkout dev

