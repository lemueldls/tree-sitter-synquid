import XCTest
import SwiftTreeSitter
import TreeSitterSynquid

final class TreeSitterSynquidTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_synquid())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Synquid grammar")
    }
}
