import { convertKshToNumber } from ".";
import mpesaMessages from "../sms.json";

const fulizaMessages = mpesaMessages.filter((m) =>
	m.body.includes("Fuliza M-PESA amount"),
);

const receivedMessages = mpesaMessages.filter((m) =>
	m.body.includes("You have received"),
);

const sentMessages = mpesaMessages.filter(
	(m) => m.body.includes("sent to") || m.body.includes("paid to"),
);

const withdrawMessages = mpesaMessages.filter((m) =>
	m.body.includes("Withdraw Ksh"),
);

const boughtAirtimeMessages = mpesaMessages.filter((m) =>
	m.body.includes("bought Ksh"),
);

console.log("Fuliza Messages", fulizaMessages.length);
console.log("Received Messages", receivedMessages.length);
console.log("Sent Messages", sentMessages.length);
console.log("Withdraw Messages", withdrawMessages.length);
console.log("Bought Airtime Messages", boughtAirtimeMessages.length);

let totalReceived = 0;
for (const receivedMessage of receivedMessages) {
	// Extract the amount from the message body
	// eg. You have received Ksh40,000.00 from VICTORIA COMMERCIAL BANK LTD
	const amountMatch = receivedMessage.body.match(/received Ksh([^ ]+)/);
	if (amountMatch) {
		totalReceived += convertKshToNumber(amountMatch[1]);
	}
}
console.log();
console.log("Total Received", totalReceived);

let totalSent = 0;
for (const sentMessage of sentMessages) {
	// Extract the amount from the message body
	// eg. Ksh2,000.00 sent to 0700000000. New M-PESA balance is Ksh1,000.00.
	const amountMatch = sentMessage.body.match(/Ksh([^ ]+) sent to/);
	if (amountMatch) {
		totalSent += convertKshToNumber(amountMatch[1]);
		continue;
	}

	// eg. Ksh2,000.00 paid to 0700000000. New M-PESA balance is Ksh1,000.00.
	const amountMatchPaid = sentMessage.body.match(/Ksh([^ ]+) paid to/);
	if (amountMatchPaid) {
		totalSent += convertKshToNumber(amountMatchPaid[1]);
	}
}

let transactionCost = 0;
for (const mpesaMessage of mpesaMessages) {
	const body = mpesaMessage.body;
	const transactionCostMatch = body.match(/Transaction cost, Ksh([^ ]+)/);
	if (transactionCostMatch) {
		transactionCost += convertKshToNumber(transactionCostMatch[1]);
	}
}

console.log("Total Sent", totalSent);
console.log("Total Transaction Cost", transactionCost);
