# Vietnam Legal Compliance Review - VoiceTalents.AI

**Review Date:** January 2025  
**Target Market:** Vietnam  
**Reviewer Role:** Legal Compliance Analysis  
**Platform:** VoiceTalents.AI - AI Native Voice Talent Platform

---

## Executive Summary

**Risk Level:** 🔴 **HIGH** - Multiple critical compliance gaps identified that must be addressed before Vietnam launch.

The current Terms of Service and platform workflow are based on US legal framework (Delaware law). Significant modifications are required to comply with Vietnamese law for users operating in Vietnam.

---

## 🔴 CRITICAL COMPLIANCE ISSUES

### 1. Governing Law and Jurisdiction

**Current Status:** ❌ **NON-COMPLIANT**

**Current Terms (Section 11.1 in Talent Terms, Section 10.1 in Client Terms):**

- Governing Law: State of Delaware, United States
- Jurisdiction: Delaware federal/state courts

**Vietnam Requirement:**

- For Vietnamese users and Vietnamese operations, terms must be governed by Vietnamese law
- Jurisdiction should be Vietnamese courts (typically Hanoi or Ho Chi Minh City)
- Contract disputes involving Vietnamese parties should be resolved under Vietnamese law

**Required Action:**

- [ ] Create Vietnam-specific Terms of Service with Vietnamese governing law
- [ ] Update jurisdiction clauses for Vietnamese users
- [ ] Consider dual jurisdiction approach (US law for international users, Vietnam law for Vietnamese users)

---

### 2. Business Registration and Licensing

**Current Status:** ❌ **MISSING**

**Vietnam Requirements:**

- **E-Commerce Registration:** Foreign platforms operating in Vietnam must register with Ministry of Industry and Trade (Decree 147/2024/NĐ-CP, effective Dec 25, 2024)
- **Decree 147/2024 Requirements:**
  - Foreign cross-border service providers must notify contact information to Ministry of Information and Communications (MIC)
  - Required if: Using Vietnam data storage OR attracting 100,000+ monthly visits from Vietnam
  - Must cooperate with authorities in handling violations
- **Penalty:** Non-compliance can result in domain/app blocking (see Temu/Shein cases, Nov 2024)

**Required Action:**

- [ ] Register platform with Ministry of Industry and Trade
- [ ] Notify Ministry of Information and Communications with contact information
- [ ] Establish local legal entity or authorized representative in Vietnam (if required)
- [ ] Add registration numbers and Vietnam business address to Terms

---

### 3. Data Localization and Storage

**Current Status:** ❌ **NON-COMPLIANT**

**Vietnam Requirements:**

- **Data Protection Law (Effective Nov 2024):** Strict regulations on personal data processing
- **Data Localization:** Certain data types must be stored within Vietnam
- **Overseas Transfer:** Prior authorization required for transferring specific data categories overseas
- **Decree 147/2024:** Foreign platforms using Vietnam data storage have additional obligations

**Required Action:**

- [ ] Establish data centers/storage in Vietnam for user data
- [ ] Update Privacy Policy to specify Vietnam data storage
- [ ] Implement data localization protocols
- [ ] Obtain authorization for any overseas data transfers
- [ ] Add data localization disclosure to Terms

---

### 4. Content Moderation and 24-Hour Takedown

**Current Status:** ❌ **MISSING**

**Vietnam Requirements:**

- **24-Hour Takedown Rule:** Platforms must remove illegal content within 24 hours of notification
- **Live Stream Blocking:** Violating live streams must be blocked within 3 hours
- **Cooperation with Authorities:** Must cooperate with government in content removal
- **Penalty:** Service bans for non-compliance

**Required Action:**

- [ ] Implement content moderation system
- [ ] Develop 24-hour takedown workflow
- [ ] Add content moderation terms to Terms of Service
- [ ] Establish channels for government notifications
- [ ] Create content removal procedures

---

### 5. Digital Contracts and Electronic Signatures

**Current Status:** ⚠️ **REVIEW NEEDED**

**Vietnam Law on Electronic Transactions:**

- Digital contracts are legally recognized
- Electronic signatures are valid if:
  - Method identifies the signer
  - Method shows signer's approval of content
  - Method is reliable and suitable for document purpose
- **Thông tư 06/2024/TT-BTTTT:** Recognizes foreign electronic signature providers (effective Aug 15, 2024)

**Current Workflow:**

- ✅ Digital service agreements created automatically upon proposal approval
- ⚠️ Need to verify signature method meets Vietnam standards
- ⚠️ Agreements may need to be stored in Vietnam

**Required Action:**

- [ ] Verify current "approval" mechanism qualifies as valid electronic signature under Vietnam law
- [ ] Ensure agreement storage complies with data localization requirements
- [ ] Consider implementing Vietnam-certified e-signature solution
- [ ] Add electronic signature acknowledgment language to agreements

---

### 6. Intellectual Property Compliance

**Current Status:** ⚠️ **PARTIALLY COMPLIANT**

**Vietnam Decree 17/2023/NĐ-CP:**

- Intermediary service providers must remove/disable access to infringing digital content upon notification
- Must develop tools to receive and process takedown requests
- Increased IP violation penalties (2025 amendments):
  - Individuals: VND 200M - VND 2B fines
  - Companies: VND 2B - VND 40B fines

**Current Terms:**

- ✅ Work-for-hire IP ownership clearly stated
- ✅ IP infringement removal rights included
- ⚠️ No specific Vietnam IP takedown procedures mentioned

**Required Action:**

- [ ] Implement IP takedown request system compliant with Decree 17/2023
- [ ] Add Vietnam-specific IP protection procedures to Terms
- [ ] Develop content monitoring for IP violations

---

### 7. Escrow and Payment Services

**Current Status:** ⚠️ **REVIEW REQUIRED**

**Vietnam Financial Regulations:**

- Escrow services may require money transmission or payment intermediary licenses
- Foreign payment services have specific regulations
- VAT obligations on e-commerce platforms

**Current Implementation:**

- Platform operates escrow system (holding client funds until deliverable completion)
- ⚠️ Unclear if this requires Vietnam financial services license

**Required Action:**

- [ ] Consult Vietnam financial regulator on escrow licensing requirements
- [ ] Determine if money transmission license needed
- [ ] Clarify VAT obligations and registration requirements
- [ ] Update payment terms with Vietnam-specific disclosures if needed

---

### 8. Taxation

**Current Status:** ⚠️ **INCOMPLETE**

**Vietnam Tax Requirements:**

- VAT registration may be required for e-commerce platforms
- Foreign digital services face tighter tax regulations
- Consideration of ending tax exemptions for low-cost imports (2024)

**Current Terms:**

- Generic statement: "You are responsible for reporting income to tax authorities"
- No Vietnam-specific tax guidance

**Required Action:**

- [ ] Add Vietnam-specific tax obligations section
- [ ] Clarify platform's VAT obligations
- [ ] Provide guidance on talent income tax reporting in Vietnam
- [ ] Consult with Vietnam tax experts on withholding obligations (if any)

---

### 9. Age Requirements and Child Labor

**Current Status:** ✅ **COMPLIANT**

**Vietnam Requirements:**

- Minimum working age generally 15+ (with exceptions for certain industries)
- Child voice acting may require special permits
- Guardian management for minors is appropriate

**Current Terms:**

- ✅ Guardian-managed accounts for minors included
- ✅ Age verification requirements stated

**Note:** Verify Vietnam-specific age requirements for voice acting work.

---

### 10. User Verification (eKYC)

**Current Status:** ⚠️ **RECOMMENDED**

**Vietnam Best Practice:**

- VNeID (Vietnam National Electronic Identity) system available
- eKYC recommended for platform security and compliance

**Required Action:**

- [ ] Consider implementing VNeID integration for Vietnamese users
- [ ] Add identity verification requirements to Terms
- [ ] Ensure compliance with Vietnam personal data protection laws

---

## 📋 REQUIRED TERMS UPDATES

### A. Add Vietnam-Specific Section to Both Terms Documents

**New Section: "Vietnam-Specific Terms"**

```markdown
## X. Vietnam-Specific Terms and Compliance

### X.1 Applicable Law for Vietnamese Users

For users located in Vietnam or transacting with Vietnamese parties, these Terms are governed by the laws of the Socialist Republic of Vietnam. Disputes shall be resolved in the competent courts of Vietnam.

### X.2 Business Registration

VoiceTalents.AI operates in Vietnam in compliance with Decree 147/2024/NĐ-CP on Internet Services and Online Information. Our registration details:

- [Registration Number]
- Ministry of Industry and Trade Registration: [Number]
- Vietnam Business Address: [Address]

### X.3 Data Storage and Localization

- Personal data of Vietnamese users is stored in accordance with Vietnam's data protection laws
- Certain data must be stored within Vietnam as required by law
- Overseas data transfers require prior authorization per Vietnamese regulations

### X.4 Content Moderation

- VoiceTalents.AI complies with Vietnam's 24-hour content takedown requirements
- Illegal content will be removed within 24 hours of notification
- Users must comply with Vietnam's content regulations

### X.5 Intellectual Property Compliance

- Platform complies with Decree 17/2023/NĐ-CP on IP protection
- IP takedown requests will be processed per Vietnamese regulations
- Users must respect Vietnamese IP laws

### X.6 Tax Obligations

- Vietnamese users are responsible for Vietnam tax obligations
- Platform may be required to report transactions per Vietnamese tax law
- Consult Vietnam tax professionals for specific obligations
```

### B. Update Governing Law Sections

**Current:**

```
These Terms are governed by the laws of the State of Delaware, United States.
```

**Should Be (for Vietnamese users):**

```
For users located in Vietnam, these Terms are governed by the laws of the Socialist Republic of Vietnam. For international users, these Terms are governed by the laws of the State of Delaware, United States.
```

---

## 🔄 WORKFLOW COMPLIANCE REVIEW

### Current Workflow Analysis

1. **User Sign-In → Onboarding → Agreement Acceptance → Profile Setup**
   - ✅ Explicit agreement acceptance implemented
   - ⚠️ Need to verify e-signature compliance

2. **Job Posting → Budget Setting → Proposal Submission → Agreement Creation**
   - ✅ Digital service agreements created automatically
   - ⚠️ Need to ensure agreements stored in Vietnam (if required)
   - ⚠️ Need to verify approval mechanism = valid e-signature

3. **Escrow Payment Flow**
   - ✅ Client payment held in escrow
   - ✅ Release upon deliverable approval
   - ⚠️ Need to verify financial licensing requirements

### Recommended Workflow Enhancements

1. **Pre-Registration:**
   - [ ] Add Vietnam business registration disclosure
   - [ ] Add data localization notice

2. **Onboarding:**
   - [ ] Add Vietnam-specific consent checkboxes (if needed)
   - [ ] Include Vietnam law acknowledgment

3. **Agreement Creation:**
   - [ ] Verify electronic signature method meets Vietnam standards
   - [ ] Ensure agreements stored in Vietnam-compliant location
   - [ ] Add Vietnam law acknowledgment to agreements

4. **Content Management:**
   - [ ] Implement content moderation queue
   - [ ] Create 24-hour takedown workflow
   - [ ] Establish government notification channel

---

## ⚠️ IMMEDIATE ACTION ITEMS (PRE-LAUNCH)

### Legal/Compliance

1. [ ] **Register with Ministry of Industry and Trade** (E-Commerce)
2. [ ] **Notify Ministry of Information and Communications** (Decree 147/2024)
3. [ ] **Consult Vietnam legal counsel** on:
   - Financial services licensing for escrow
   - Tax registration and obligations
   - Data localization requirements
   - Electronic signature compliance

### Technical/Operational

4. [ ] **Set up Vietnam data storage** (if required)
5. [ ] **Implement content moderation system** (24-hour takedown)
6. [ ] **Create IP takedown request system** (Decree 17/2023 compliance)
7. [ ] **Add Vietnam business information** to Terms and Privacy Policy

### Documentation

8. [ ] **Create Vietnam-specific Terms** (or add Vietnam section)
9. [ ] **Update Privacy Policy** for Vietnam data protection law
10. [ ] **Add Vietnam compliance disclosures** to platform

---

## 📊 RISK ASSESSMENT

| Issue                 | Risk Level | Impact                       | Urgency    |
| --------------------- | ---------- | ---------------------------- | ---------- |
| Wrong Governing Law   | 🔴 HIGH    | Legal disputes unenforceable | Immediate  |
| Unregistered Platform | 🔴 HIGH    | Domain/app blocking          | Immediate  |
| Data Localization     | 🔴 HIGH    | Fines, service restrictions  | Immediate  |
| Content Moderation    | 🔴 HIGH    | Service ban                  | Immediate  |
| Escrow Licensing      | 🟡 MEDIUM  | Financial penalties          | Pre-launch |
| IP Compliance         | 🟡 MEDIUM  | Fines up to VND 40B          | Pre-launch |
| Tax Obligations       | 🟡 MEDIUM  | Back taxes, penalties        | Pre-launch |

---

## ✅ WORKFLOW VALIDATION

### Digital Service Agreement Workflow

**Current Flow:**

1. Client sets budget → Creates job posting
2. Talent submits proposal (cost, timeline, samples)
3. Client approves proposal
4. **Digital service agreement automatically created**
5. Payment placed in escrow
6. Deliverables completed → Payment released

**Vietnam Compliance Check:**

- ✅ Digital contracts legally recognized (Law on Electronic Transactions)
- ⚠️ Approval mechanism must qualify as e-signature
- ⚠️ Agreements must be stored per data localization requirements
- ✅ Workflow structure is sound, needs Vietnam-specific compliance layers

---

## 📝 RECOMMENDATIONS

### Short-Term (Before Launch)

1. **Legal Consultation:** Engage Vietnam legal counsel immediately
2. **Registration:** Complete all required government registrations
3. **Terms Update:** Create Vietnam-specific terms or add Vietnam sections
4. **Data Infrastructure:** Set up Vietnam-compliant data storage
5. **Content Systems:** Implement moderation and takedown workflows

### Medium-Term (Post-Launch)

1. **Tax Registration:** Complete VAT and tax registrations
2. **Financial Licensing:** Resolve escrow licensing if required
3. **Compliance Monitoring:** Establish ongoing compliance monitoring
4. **User Education:** Educate users on Vietnam-specific requirements

---

## 🎯 CONCLUSION

The current Terms and workflow have a **sound structure** but require **significant Vietnam-specific modifications** before launch. The platform concept (digital service agreements, escrow payments, intermediary model) is legally viable in Vietnam, but compliance with Vietnamese regulations is mandatory.

**Priority Actions:**

1. Engage Vietnam legal counsel
2. Complete government registrations
3. Update Terms with Vietnam law
4. Implement compliance infrastructure

**Estimated Timeline:** 4-8 weeks for full compliance (depending on registration processing times)

---

**Next Steps:**

1. Review this document with Vietnam legal counsel
2. Obtain specific licensing requirements
3. Create Vietnam-compliant Terms of Service
4. Implement required technical changes

---

© 2025 AI For Humanity Labs Inc. All rights reserved.
