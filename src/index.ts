// ref: https://github.com/prometheus/prometheus/blob/main/web/ui/react-app/src/pages/graph/ExpressionInput.tsx

import { EditorView, highlightSpecialChars, keymap, ViewUpdate, placeholder } from '@codemirror/view';
import { EditorState, Prec, Compartment } from '@codemirror/state';
import { bracketMatching, indentOnInput, syntaxHighlighting, syntaxTree } from '@codemirror/language';
import { defaultKeymap, history, historyKeymap, insertNewlineAndIndent } from '@codemirror/commands';
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search';
import { lintKeymap } from '@codemirror/lint';
import {
  autocompletion,
  completionKeymap,
  CompletionContext,
  CompletionResult,
  closeBrackets,
  closeBracketsKeymap,
} from '@codemirror/autocomplete';
import { baseTheme, lightTheme, darkTheme, promqlHighlighter, darkPromqlHighlighter } from './CMTheme';

import { PromQLExtension } from "@prometheus-io/codemirror-promql";

// import {
//   CompleteStrategy,
//   newCompleteStrategy,
// } from "@prometheus-io/codemirror-promql";

const promqlExtension = new PromQLExtension();

const highlighter = syntaxHighlighting(promqlHighlighter);

const startState = EditorState.create({
  doc: "",
  extensions: [
    lightTheme,
    highlightSpecialChars(),
    history(),
    EditorState.allowMultipleSelections.of(true),
    indentOnInput(),
    bracketMatching(),
    closeBrackets(),
    autocompletion(),
    highlightSelectionMatches(),
    EditorView.lineWrapping,
    keymap.of([
      ...closeBracketsKeymap,
      ...defaultKeymap,
      ...searchKeymap,
      ...historyKeymap,
      ...completionKeymap,
      ...lintKeymap,
    ]),
    placeholder("Expression (press Shift+Enter for newlines)"),
    highlighter,
    promqlExtension.asExtension(),
    //   dynamicConfigCompartment.of(dynamicConfig),
    // This keymap is added without precedence so that closing the autocomplete dropdown
    // via Escape works without blurring the editor.
    //   keymap.of([
    //     {
    //       key: 'Escape',
    //       run: (v: EditorView): boolean => {
    //         v.contentDOM.blur();
    //         return false;
    //       },
    //     },
    //   ]),
    //   Prec.override(
    //     keymap.of([
    //       {
    //         key: 'Enter',
    //         run: (v: EditorView): boolean => {
    //           executeQuery();
    //           return true;
    //         },
    //       },
    //       {
    //         key: 'Shift-Enter',
    //         run: insertNewlineAndIndent,
    //       },
    //     ])
    //   ),
    //   EditorView.updateListener.of((update: ViewUpdate): void => {
    //     onExpressionChange(update.state.doc.toString());
    //   }),
  ],
});

const view = new EditorView({
  state: startState,
  parent: document.getElementById("editor")!,
});

view.focus();
