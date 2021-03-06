// The table is made of 118 <center> elements placed on a 18x10 grid.
// All the sizes are proportional to the screen's width to make the table responsive

// Counters:
// - i is the atomic number of the current element minus 1 (0 to 117)
// - j is the position of the element in the grid (0 to 179)
i = j = 0;

// Data:
// This string contains information for all 118 elements:
// - The element's name (1 or 2 chars, starting with a capital letter)
// - The element's occurence if it's from decay (using the char "@")
// - The element's type (numbered from 0 to 9, only if it differs from the previous element)
// - The element's atomic mass (encoded on two chars in base36)
// - The element's state at room temperature ("#" = gas, "~" = liquid, solid by default)

// The capital letter at the beginning of the next element marks the end of the current one,
// That's why the string ends with a dummy "Z", in order to interpret the 118th element correctly.
// Here the string is shown on 118 lines for more readability, but it's on a single line after minification.
'H9xc#\
He3yk#\
Li0zm\
Be1y9\
B8w5\
C9sd\
Nqt#\
Op8#\
F2qg#\
Ne3mm#\
Na0nb\
Mg1jv\
Al7k6\
Si8g5\
P9h1\
Scy\
Cl2f9#\
Ar3kn#\
K0b6\
Ca16s\
Sc6d8\
Tie7\
Vfm\
Crbg\
Mnci\
Fe7x\
Co9d\
Ni1l\
Cu7z\
Zn75y\
Gaaw\
Ge8bv\
Asb4\
Se9f9\
Br2aq~\
Kr3eg#\
Rb0bz\
Sr1au\
Y67b\
Zr6m\
Nb47\
Mo5j\
Tc@3v\
Ru5j\
Rh3j\
Pd66\
Ag33\
Cd78l\
In86\
Snbv\
Sb8d8\
Temc\
I2da\
Xe3id#\
Cs0fr\
Ba1kx\
La4i7\
Ceeg\
Pr9j\
Ndbo\
Pm@6f\
Smeg\
Eubs\
Gdjd\
Tbgx\
Dyjq\
Hojd\
Eriq\
Tmg9\
Yb5v\
Lu43\
Hf66r\
Ta6h\
W7e\
Re6v\
Osax\
Ir9c\
Pta6\
Au8b\
Hg7b9~\
Tleo\
Pbfe\
Bid8\
Po@64\
At@21t\
Rn@3s4\
Fr@0ns\
Ra@1p1\
Ac@5kp\
Thri\
Pa@hm\
Utx\
Np@k3\
Pu@wg\
Ammk\
Cmql\
Bkjh\
Cfni\
Esj6\
Fmq0\
Mdlo\
Nohc\
Lrtq\
Rf6pe\
Dbl3\
Sgmb\
Bhcf\
Hsot\
Mtki\
Dslr\
Rghf\
Cn7io\
Nhed\
Flfl\
Mc8h\
Lvci\
Ts287\
Og313#\
Z'
.replace(
  // Use a RegEx to isolate every bit of information, followed by a capital letter.
  /(..*?)(@)?(\d)?(..)(#)?(~)?(?=[A-Z])/g,
  
  // d = name
  // a = occurs from decay (optional)
  // n = type (optional)
  // r = atomic mass
  // o = solid (optional)
  // l = liquid (optional)
  (e,d,a,n,r,o,l) => {
    
    // For each element:
    // Add a <center> tag in the page's body
    b.innerHTML +=
      `<center style='
        
        /* CSS */
        /* Note: "left" and "right" dimensions are written in "%" instead of "vw" to save one byte */
        /* font-size: 1vw (1% of the screen width) */
        /* line-height: 0.05vw (to cancel the margin of the h2) */
        /* font-family: arial */
        font:1vw/5% arial;
        
        /* width: 3.5vw */
        width:3.5%;
        
        /* padding adjusted to make the gutters look equal between the cells */
        /* note: there is no space between .7% and .5% to save one byte. It is valid CSS */
        padding:.7%.5%;
        
        /* make the element default position on the top-left of the screen */
        position:absolute;
        
        /* Move the cell horizontally according to j%18 and vertically according to j/18 */
        /* Coefficients and offsets are added to these values to make the gutters and center the table */
        margin:${4.4 * ~~(j / 18) + 1}%${j % 18 * 5 + 4}vw;
        
        /* Border is dashed if a is set, otherwise, dotted for elements 95-118 and solid for elements 1-94 */
        border:2px ${a ? "dashed" : i > 93 ? "dotted" : "solid"};
        
        /* Background: */
        /* The variable t is used to remember the hue of the last cell */
        /* If n is set, t is recomputed and used instead of the last cell hue */
        /* Lightness is 65 for all elements except 109-111 & 113-118 where it is 75 (type is not yet observed) */
        /* The hsl() parenthesis is not closed to save a byte */
        background:hsl(${n ? t = 35 * n : t},50%,${i > 107 ^ i != 111 ? 65 : 75}%'>
        
          <!-- atomic number and element's state at room temperature: Gas if o is set, Liquid if l is set, Solid otherwise -->
          ${i + 1} ${o ? "G" : l ? "L" : "S"}
          
          <!-- Name -->
          <h2>${d}</h2>`
          
          // The string after the name is concatenated to save a few bytes over the template literal's "${}".
          
          +
          
          // Atomic mass:
          // It's the average weight of the element and its isotopes, pondered by their abundance, and compared to 1/12 of the mass of a carbon-12 element.
          // How it was encoded:
          // - the mass is multiplied by 100 to get rid of the decimal part (ex: 1.00 => 100 ... 294.21 => 29421).
          // - the number is converted to 2 ASCII chars using this magic formula: x=>(x-i*256+(i>68?570:1100)).toString(36) (ex: 100 => "xc" ... 29421 => "13")
          // This formula exploits the fact that the mass * 100 is nearly equal to 256 times the atomic number plus 570 (when i > 68) or 1100 (when i < 68).
          // The difference (between the mass * 100 and the atomic number * 256 + 570 or 1100) is smaller than 1295, and so it can be encoded on only two chars in base 36.
          // Here, the mass is decoded by performing exactly the opposite operation:
          // (base36 value) + 256 * (atomic mass) - (i > 68 ? 570 : 1100) / 100
          // .toFixed(2) forces the mass to be a String including only 2 decimals
          (
            (
              parseInt(r, 36) + 256 * i - (68 < i ? 570 : 1100)
            ) / 100
          ).toFixed(2)
          
          // Add a decimal to the 5 first elements' atomic mass (respectively 8, 3, 1, 2 and 1)
          // The following elements (6-118) will not have a corresponding char in "83121",
          // but the surrounding array will make [undefined] become an empty string.
          + ["83121"[i]]
          
          // Add a "*" if the element is unstable a.k.a. has no stable isotope
          // (elements 43, 61 and 84 to 118).
          // The following code is equivalent to "* "[42 == i || 60 == i || 83 > i].
          + "* "[42 != i ^ 60 != i ^ 83 > i],
          
          // Adjust j to the position of the next element on the grid, or increment it by 1 by default.
          // - jump 17 cells after element 1.
          // - jump 11 cells after elements 4 and 12.
          // - jump 54 cells after elements 57 and 89.
          // - jump -67 cells after elements 71 and 103.
          // And finally, increment i (next element's index).
          j += 1 | {0: 17, 3: 11, 11: 11, 56: 54, 88: 54, 70: -67, 102: -67}[i++]
  }
)
// This demo is 1024 bytes minified, RegPack doesn't save extra bytes.
// It outputs 21,157 bytes of HTML, which is less than PERIOD1K reloaded, because less inline CSS is present here
// (no text-shadow, no white font-color, no margins with a ton of decimals)