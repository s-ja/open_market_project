interface SignUpForm {
	email: string;
	password: string;
	confirmPassword: string;
	name: string;
	phone: string;
	extra: {
		terms: {
			termsOfUse: boolean;
			providingPersonalInformation: boolean;
			recievingMarketingInformation: boolean;
			confirmAge: boolean;
		};
	};
}

interface SignUpRequest {
	email: string;
	password: string;
	name: string;
	phone: string;
	type: string;
}
