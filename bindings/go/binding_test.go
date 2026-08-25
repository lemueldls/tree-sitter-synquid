package tree_sitter_synquid_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_synquid "github.com/lemueldls/tree-sitter-synquid/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_synquid.Language())
	if language == nil {
		t.Errorf("Error loading Synquid grammar")
	}
}
