.PHONY: linttest
linttest:
	ruff check .
	ruff format --check --diff .

.PHONY: lintfix
lintfix:
	ruff format .
	ruff check --fix-only .
	ruff format .
	ruff check --fix-only .
