

export class Job {

    jobId?: number;
    jobTitle: string;
    createdBy?: string;
    publishedOn?: Date;
    closedOn?: Date;
    recordStatus?: number;
    companyId?: string;
    publishToFaceIt: boolean = false;

    constructor(init?: Partial<Job>) {
        if (init) {
            Object.assign(this, init);
        }
        this.jobId = this.jobId;
        this.jobTitle = this.jobTitle;
        this.createdBy = this.createdBy;
        this.publishedOn = this.publishedOn;
        this.closedOn = this.closedOn;
        this.recordStatus = this.recordStatus;
        this.companyId = this.companyId;
        this.publishToFaceIt = this.publishToFaceIt;
    }

}

export class JobDetail {
    jobDetId: number;
    jobTitle: string;
    jobSkills: string;
    jobDescription: string;
    jobResponsibilities: string;
    jobEducation: string;
    jobCountry: string;
    jobLocations: string;
    jobWorkExp: string;
    jobSalaryRange: string;
    status: number;
    jobId: number;

    constructor(init?: Partial<JobDetail>) {
        if (init) {
            Object.assign(this, init);
        }

        this.jobDetId = this.jobDetId;
        this.jobTitle = this.jobTitle;
        this.jobSkills = this.jobSkills;
        this.jobDescription = this.jobDescription;
        this.jobResponsibilities = this.jobResponsibilities;
        this.jobEducation = this.jobEducation;
        this.jobCountry = this.jobCountry;
        this.jobLocations = this.jobLocations;
        this.jobWorkExp = this.jobWorkExp;
        this.jobSalaryRange = this.jobSalaryRange;
        this.status = this.status;
        this.jobId = this.jobId;
    }
}

export class JobAssign {
    jobAssignId: number;
    jobId: number;
    contactId: number;
    name: string;
    email: string;
    phone: string;
    selected: boolean;

    constructor(init?: Partial<JobAssign>) {
        if (init) {
            Object.assign(this, init);
        }
        this.jobAssignId = this.jobAssignId;
        this.jobId = this.jobId;
        this.contactId = this.contactId;
        this.name = this.name;
        this.email = this.email;
        this.phone = this.phone;
        this.selected = this.selected;
    }
}

export class JobContact {
    jobContactId: number;
    jobId: number;
    name: string;
    email: string;
    phone: string;

    constructor(init?: Partial<JobContact>) {
        if (init) {
            Object.assign(this, init);
        }
        this.jobContactId = this.jobContactId;
        this.jobId = this.jobId;
        this.name = this.name;
        this.email = this.email;
        this.phone = this.phone;
    }
}

export class MyTask {
    jobId: number;
    jobTag: string;
    startOn?: Date;
    endsOn?: Date;
    typeId: number;
    assignedBy: string;

    constructor(init?: Partial<MyTask>) {
        if (init) {
            Object.assign(this, init);
        }
        this.jobId = this.jobId;
        this.jobTag = this.jobTag;
        this.startOn = this.startOn;
        this.endsOn = this.endsOn;
        this.typeId = this.typeId;
        this.assignedBy = this.assignedBy;
    }
}

export class JobHeader {
    jobId: number;
    jobTag: string;
    jobTitle: string;
    createdBy: string;
    publishedOn?: Date;
    createdOn: Date;
    closedOn?: Date;
    statusTag: string;
    status: number;

    constructor(init?: Partial<JobHeader>) {
        if (init) {
            Object.assign(this, init);
        }
        this.jobId = this.jobId;
        this.jobTag = this.jobTag;
        this.jobTitle = this.jobTitle;
        this.createdBy = this.createdBy;
        this.publishedOn = this.publishedOn;
        this.createdOn = this.createdOn;
        this.closedOn = this.closedOn;
        this.statusTag = this.statusTag;
        this.status = this.status;
    }
}

export class JobImport {
    title: string;
    skills: string;
    description: string;
    responsibilities: string;
    education: string;
    locations: string;
    minYear: number;
    maxYear: number;
    minSalary: number;
    maxSalary: number;
    name: string;
    email: string;
    phone: string;
    jobCountry: string;

    constructor(init?: Partial<JobImport>) {
        if (init) {
            Object.assign(this, init);
        }
        this.title = this.title;
        this.skills = this.skills;
        this.description = this.description;
        this.responsibilities = this.responsibilities;
        this.education = this.education;
        this.locations = this.locations;
        this.minYear = this.minYear;
        this.maxYear = this.maxYear;
        this.minSalary = this.minSalary;
        this.maxSalary = this.maxSalary;
        this.name = this.name;
        this.email = this.email;
        this.phone = this.phone;
        this.jobCountry = this.jobCountry;
    }
}

export class JobSchedule {
    jobId: number;
    jStatus: number;
    jobTag: string;

    canId: number;
    cStatus: number;
    cName: string;
    cEmail: string;
    cPhone: string;
    cTime: string;

    evaId: number;
    iStatus: number;
    eName: string;
    eEmail: string;
    ePhone: string;
    eTime: string;

    resume: string;
    jobDescription: string;
    status: string;

    scheduledOn: Date;
    sessionTag: string;
    sessionId: number;

    constructor(init?: Partial<JobSchedule>) {
        if (init) {
            Object.assign(this, init);
        }
        this.jobId = this.jobId;
        this.jStatus = this.jStatus;
        this.jobTag = this.jobTag;
        this.canId = this.canId;
        this.cStatus = this.cStatus;
        this.cName = this.cName;
        this.cEmail = this.cEmail;
        this.cPhone = this.cPhone;
        this.cTime = this.cTime;
        this.evaId = this.evaId;
        this.iStatus = this.iStatus;
        this.eName = this.eName;
        this.eEmail = this.eEmail;
        this.ePhone = this.ePhone;
        this.eTime = this.eTime;
        this.resume = this.resume;
        this.jobDescription = this.jobDescription;
        this.status = this.status;
        this.scheduledOn = this.scheduledOn;
        this.sessionTag = this.sessionTag;
        this.sessionId = this.sessionId;
    }
}

export class JobTask {
    jobId: number;
    jobTag: string;
    start?: Date;
    end?: Date;
    createdBy: string;

    constructor(init?: Partial<JobSchedule>) {
        if (init) {
            Object.assign(this, init);
        }
        this.jobId = this.jobId;
        this.jobTag = this.jobTag;
        this.start = this.start;
        this.end = this.end;
        this.createdBy = this.createdBy;

    }
}

export class JobApplied {
    appliedId: number;
    appliedOn: Date;
    appliedTypeId: number;
    candidateId: number;
    iCandidateId: number;
    candidate: string;
    email: string;
    reviewer: string;
    dailingCode: string;
    mobileNumber: string;
    rating: number;
    answered: number;
    answer: string;
    codeId: number;
    question: string;

    constructor(init?: Partial<JobApplied>) {
        if (init) {
            Object.assign(this, init);
        }
        this.appliedId = this.appliedId;
        this.appliedOn = this.appliedOn;
        this.appliedTypeId = this.appliedTypeId;
        this.candidateId = this.candidateId;
        this.iCandidateId = this.iCandidateId;
        this.candidate = this.candidate;
        this.email = this.email;
        this.reviewer = this.reviewer;
        this.dailingCode = this.dailingCode;
        this.mobileNumber = this.mobileNumber;
        this.rating = this.rating;
        this.answered = this.answered;
        this.answer = this.answer;
        this.codeId = this.codeId;
        this.question = this.question;

    }

    get appliedFrom(): string {
        return this.appliedTypeId === 0 ? "Internal Processing" : "Applied from FaceInterview";
    }
}

export class JobAppliedShort {
    challengeId: number;
    answered: number;
    answer: string;
    codeId: number;
    question: string;

    constructor(init?: Partial<JobAppliedShort>) {
        if (init) {
            Object.assign(this, init);
        }
        this.answered = this.answered;
        this.answer = this.answer;
        this.codeId = this.codeId;
        this.question = this.question;
    }
}

export class JobCodeChallenge {
    challengeId: number;
    appliedId: number;
    candidateId: number;
    companyId: number;
    challengedOn: Date;
    question: string;
    answer: string;
    codeId: number;
    recordStatus: number;

    constructor(init?: Partial<JobCodeChallenge>) {
        if (init) {
            Object.assign(this, init);
        }
        this.challengeId = this.challengeId;
        this.appliedId = this.appliedId;
        this.candidateId = this.candidateId;
        this.companyId = this.companyId;
        this.challengedOn = this.challengedOn;
        this.question = this.question;
        this.answer = this.answer;
        this.codeId = this.codeId;
        this.recordStatus = this.recordStatus;
    }
}
