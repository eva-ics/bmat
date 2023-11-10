all:
	npm run build

bump:
	npm version --no-git-tag-version patch

pub: all upload doc

upload:
	npm publish --access public

doc:
	rm -rf docs
	npx typedoc src/*.ts
	cd docs && gsutil -m cp -a public-read -r . gs://pub.bma.ai/dev/docs/bmat/
