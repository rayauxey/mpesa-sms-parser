interface SMS {
	address: string;
	body: string;
	date: Date;
}

export function convertKshToNumber(kshString: string) {
	// Remove 'Ksh' prefix and any commas
	const numericString = kshString.replace(/Ksh|,/g, "");

	// Parse the resulting string to a float
	return Number.parseFloat(numericString);
}

function convertToJson(xmlString: string): SMS[] {
	const smsList: SMS[] = [];
	const lines = xmlString.split("\n");
	for (const line of lines) {
		if (line.includes('address="MPESA"')) {
			const address = line.match(/address="([^"]+)"/);
			const body = line.match(/body="([^"]+)"/);
			const date = line.match(/date_sent="([^"]+)"/);
			if (address && body && date) {
				smsList.push({
					address: address[1],
					body: body[1],
					date: new Date(Number.parseInt(date[1])),
				});
			}
		}
	}
	return smsList;
}
console.time("readFile");
const xmlString = await Bun.file("sms.xml").text();
console.timeEnd("readFile");

console.time("convertToJson");
const smsList = convertToJson(xmlString);
console.timeEnd("convertToJson");

await Bun.write("sms.json", JSON.stringify(smsList, null, 2));
