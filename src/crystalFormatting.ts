import * as vscode from 'vscode'
import { spawn } from 'child_process'
import { CrystalProblemsFinder } from "./crystalProblemsFinder"

export class CrystalFormattingProvider extends CrystalProblemsFinder implements vscode.DocumentFormattingEditProvider {

	/**
	 * Execute crystal tool format and get response.
	 */
	execFormat(document: vscode.TextDocument) {
		return new Promise(function (resolve, reject) {
			let response = ''
			let child = spawn('crystal', ['tool', 'format', '--no-color', '-f', 'json', '-'])
			child.stdin.write(document.getText())
			child.stdin.end()
			child.stdout.on('data', (data) => {
				response += data
			})
			child.stdout.on('end', () => {
				return resolve(response)
			})
			child.on('exit', (exitCode) => {
				if (exitCode != 0) {
					console.error('ERROR: crystal tool format exit with code ' + exitCode)
					console.info('INFO: syntax error or crystal bug')
					return resolve('')
				}
			})
		})
	}

	/**
	 * Formatting provider checking syntax error before
	 */
	async provideDocumentFormattingEdits(document: vscode.TextDocument) {
		let response = await this.execFormat(document)
		let textEditData: vscode.TextEdit[] = []

		if ((this.searchProblems(response.toString(), document.uri).length == 0) &&
			response.toString().length > 0) {
			let lastLineId = document.lineCount - 1
			let range = new vscode.Range(0, 0, lastLineId, document.lineAt(lastLineId).text.length)
			textEditData = [vscode.TextEdit.replace(range, response.toString())]
		}

		return textEditData
	}
}
