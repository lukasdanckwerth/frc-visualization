
commands: $(eval .SILENT:)
	echo "targets:" && echo ""
	echo "  update        Start developing on branch dev"
	echo "  patch         Patch npm version. Push."
	echo "  stage         Merge stage with dev. Then push."
	echo "  production    Merge production with stage. Then push."
	echo ""

update:
	git pull origin dev
	git checkout dev

patch:
	npm --no-git-tag-version version patch
  npm run assets
	git push --follow-tags

stage:
	git checkout stage
	git pull origin stage
	git merge dev
	git push origin stage
	git checkout dev

production:
	git checkout main
	git pull origin stage
	git pull origin main
	git merge stage
	git push origin main
	git checkout dev
