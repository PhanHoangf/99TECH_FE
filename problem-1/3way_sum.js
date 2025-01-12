function sum_to_n_a(n) {
    if (n === 0) {
        return 0;
    }

    return n + sum_to_n_a(n - 1);
}

function sum_to_n_b(n) {
    let res = 0;
    for (let index = 1; index <= n; index++) {
        res += index;
    }
    return res;
}

function sum_to_n_c(n) {
    return ((n * n) / 2) + n / 2;
}

