// A+: Can receive A+, A-, O+, or O- blood
// A- Can receive A- or O- blood
// B+: Can receive B+, B-, O+, or O- blood
// B- Can receive B- or O- blood
// AB+: Can receive any blood type
// AB- Can receive AB-, A-, B-, or O- blood
// O+: Can receive O+ or O- blood
// O- Can only receive O- blood
const blood_comp = (blood_type) => {
    let allowed = [];

    if (blood_type === "a_positive") {
        allowed = ["a_positive", "a_negative", "o_positive", "o_negative"];
    } else if (blood_type === "a_negative") {
        allowed = ["a_negative", "o_negative"];
    } else if (blood_type === "b_positive") {
        allowed = ["b_positive", "b_negative", "o_positive", "o_negative"];
    } else if (blood_type === "b_negative") {
        allowed = ["b_negative", "o_negative"];
    } else if (blood_type === "ab_positive") {
        allowed = ["a_positive", "a_negative", "b_positive", "b_negative", "ab_positive", "ab_negative", "o_positive", "o_negative"];
    } else if (blood_type === "ab_negative") {
        allowed = ["ab_negative", "a_negative", "b_negative", "o_negative"];
    } else if (blood_type === "o_positive") {
        allowed = ["o_positive", "o_negative"];
    } else if (blood_type === "o_negative") {
        allowed = ["o_negative"];
    }

    return allowed;
};

module.exports = blood_comp;