all:
	npm run build

bump:
	npm version --no-git-tag-version patch

pub: all upload doc

upload:
	cp ./README.md ./dist/
	cd dist && npm publish --access public

doc:
	rm -rf docs
	typedoc
	cd docs && gsutil -m cp -a public-read -r . gs://pub.bma.ai/dev/docs/bmat/
