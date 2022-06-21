window.onload = async function () {
  const rsvpResultsNode = document.querySelector('.RSVPResults');
  const errorsSection = document.querySelector('.RSVPErrors');

  const app = new Realm.App({ id: 'application-0-njcip' });
  const credentials = Realm.Credentials.anonymous();
  const user = await app.logIn(credentials);
  console.assert(user.id === app.currentUser.id, 'user auth failed');

  // Step 1 - find yourself
  document.querySelector('.findButton').onclick = async function(e) {
    e.preventDefault();

    while(rsvpResultsNode.firstChild) {
      rsvpResultsNode.removeChild(rsvpResultsNode.firstChild);
    }
    while(errorsSection.firstChild) {
      errorsSection.removeChild(errorsSection.firstChild);
    }

    const input = document.querySelector('#name').value;
    const results = await user.functions.findGuest(input);
    if (results.length > 0) {
      results.forEach((result) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'RSVPResult';
        const name = document.createElement('div');
        name.innerText = `${result.firstName} ${result.lastName}`;
        name.className = 'RSVPResultName';
        const selectButton = document.createElement('button');
        selectButton.innerText = 'Choose';
        selectButton.className = 'RSVPButton';
        selectButton.onclick = function(e) {
          e.preventDefault();
          selectResult(result);
        }

        wrapper.appendChild(name);
        wrapper.appendChild(selectButton);
        rsvpResultsNode.appendChild(wrapper);
      });
    } else {
      const message = document.createElement('div');
      message.innerText = "We can't find that name in our guest list. Please try again.";
      rsvpResultsNode.appendChild(message);
    }
  }

  // Step 2 - select yourself
  function selectResult(result) {
    while(rsvpResultsNode.firstChild) {
      rsvpResultsNode.removeChild(rsvpResultsNode.firstChild);
    }
    document.querySelector('.RSVPname').remove();

    if (result.guests && result.guests.length > 0) {
      displayGuests(result);
    } else {
      displayRSVPForm([result]);
    }
  }

  // Step 2.5 - select your guests
  function displayGuests(result) {
    while(rsvpResultsNode.firstChild) {
      rsvpResultsNode.removeChild(rsvpResultsNode.firstChild);
    }

    const rsvpResultsTitle = document.createElement('div');
    rsvpResultsTitle.innerText = "Please choose any other guests you'd like to RSVP for";
    rsvpResultsTitle.className = 'RSVPLabel';
    rsvpResultsNode.appendChild(rsvpResultsTitle);

    result.guests.forEach((guest) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'guestOption';
      const name = document.createElement('label');
      name.setAttribute('for', `${guest.firstName}${guest.lastName}`);
      name.innerText = `${guest.firstName} ${guest.lastName}`;
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = `${guest.firstName} ${guest.lastName}`;
      checkbox.id =  `${guest.firstName}${guest.lastName}`;

      wrapper.appendChild(checkbox);
      wrapper.appendChild(name);
      rsvpResultsNode.appendChild(wrapper);
    });

    const continueButton = document.createElement('button');
    continueButton.className = 'RSVPButton';
    continueButton.innerText = 'Continue to RSVP';

    continueButton.onclick = async function(e) {
      e.preventDefault();

      const selectedGuestPromises = [...document.querySelectorAll('input[type="checkbox"]:checked')].map(async (node) => {
        const [firstName, lastName] = node.value.split(' ');
        const dbResult = await user.functions.findOneGuest({ firstName, lastName });
        return dbResult;
      });

      const selectedGuests = await Promise.all(selectedGuestPromises);

      while(rsvpResultsNode.firstChild) {
        rsvpResultsNode.removeChild(rsvpResultsNode.firstChild);
      }

      displayRSVPForm([result, ...selectedGuests]);
    }

    rsvpResultsNode.appendChild(continueButton);
  }

  // Step 3 - RSVP
  function displayRSVPForm(guests) {
    const form = document.createElement('form');

    form.onsubmit = function(e) {
      e.preventDefault();
      const rsvps = [];

      const validationErrors = [];

      for (const guest of guests) {
        const rsvpStatus = e.target.elements[`${guest.firstName}${guest.lastName}rsvp`] ? e.target.elements[`${guest.firstName}${guest.lastName}rsvp`].value : 'false';
        if (rsvpStatus === 'true') {
          const rsvp = {
            firstName: guest.firstName,
            lastName: guest.lastName,
            rsvp: true,
            dietaryRestrictions: e.target.elements[`${guest.firstName}${guest.lastName}dietaryRestrictions`].value,
            brunch: e.target.elements[`${guest.firstName}${guest.lastName}brunch`].value,
          }

          if (!guest.isChild) {
            rsvp.meal = e.target.elements[`${guest.firstName}${guest.lastName}meal`].value;
            rsvp.transportationHotel = e.target.elements[`${guest.firstName}${guest.lastName}transportationhotel`].checked;
            rsvp.transportationTrain = e.target.elements[`${guest.firstName}${guest.lastName}transportationtrain`].checked;
            rsvp.transportationMidtown = e.target.elements[`${guest.firstName}${guest.lastName}transportationmidtown`].checked;
          }

          if (!rsvp.meal && !guest.isChild) {
            validationErrors.push("Don't forget to select a meal!");
          }
          if (!rsvp.brunch) {
            validationErrors.push("Don't forget to let us know if you will be coming to brunch!");
          }
          if (guest.hasPlusOne && !e.target.elements[`${guest.firstName}${guest.lastName}plusOne`].value) {
            validationErrors.push("Don't forget to let us know if you need a plus one!");
          }
          rsvps.push(rsvp);
        } else {
          rsvps.push({
            firstName: guest.firstName,
            lastName: guest.lastName,
            rsvp: false,
          })
        }

        if (guest.hasPlusOne && e.target.elements[`${guest.firstName}${guest.lastName}plusOne`].value === 'true') {
          const [firstName, lastName] = e.target.elements[`${guest.firstName}${guest.lastName}plusOneName`].value.split(' ');
          if (!firstName) {
            validationErrors.push("Don't forget to tell us your +1's name!");
          }
          const rsvp = {
            firstName: firstName,
            lastName: lastName,
            rsvp: true,
            meal: e.target.elements[`${guest.firstName}${guest.lastName}plusOneMeal`].value,
            dietaryRestrictions: e.target.elements[`${guest.firstName}${guest.lastName}plusOneDietaryRestrictions`].value,
            brunch: e.target.elements[`${guest.firstName}${guest.lastName}plusOneBrunch`].value,
            transportationHotel: e.target.elements[`${guest.firstName}${guest.lastName}plusOneTransportationhotel`].checked,
            transportationTrain: e.target.elements[`${guest.firstName}${guest.lastName}plusOneTransportationtrain`].checked,
            transportationMidtown: e.target.elements[`${guest.firstName}${guest.lastName}plusOneTransportationmidtown`].checked,
          }

          if (!rsvp.meal) {
            validationErrors.push("Don't forget to select a meal!");
          }
          if (!rsvp.brunch) {
            validationErrors.push("Don't forget to let us know if you will be coming to brunch!");
          }
          rsvps.push(rsvp);
        }
      }

      if (validationErrors.length) {
        while(errorsSection.firstChild) {
          errorsSection.removeChild(errorsSection.firstChild);
        }

        validationErrors.unshift('Please correct the following errors:');

        for (const error of validationErrors) {
          const errorNode = document.createElement('div');
          errorNode.innerText = error;
          errorsSection.appendChild(errorNode);
        }
      } else {
        user.functions.submitRSVPs(rsvps);
        while(rsvpResultsNode.firstChild) {
          rsvpResultsNode.removeChild(rsvpResultsNode.firstChild);
        }
        while(errorsSection.firstChild) {
          errorsSection.removeChild(errorsSection.firstChild);
        }

        const message = document.createElement('div');
        message.innerText = 'Thank you for RSVPing!';
        rsvpResultsNode.appendChild(message);
      }
    }

    guests.forEach((guest) => {
      if (guests.length > 1 || guest.hasPlusOne) {
        const nameHeader = document.createElement('h1');
        nameHeader.innerText = `${guest.firstName} ${guest.lastName}`;
        form.appendChild(nameHeader);
      }

      const rsvpLabel = document.createElement('label');
      rsvpLabel.innerText = 'Will you make it to our wedding?';
      rsvpLabel.className = 'RSVPLabel';

      const rsvpYesWrapper = document.createElement('div');
      rsvpYesWrapper.className = 'RSVPOptionGroup';
      const rsvpYes = document.createElement('input');
      rsvpYes.type = 'radio';
      rsvpYes.name = `${guest.firstName}${guest.lastName}rsvp`;
      rsvpYes.id = `${guest.firstName}${guest.lastName}rsvpYes`;
      rsvpYes.value = true;
      const rsvpYesLabel = document.createElement('label');
      rsvpYesLabel.innerText = 'yes';
      rsvpYesLabel.setAttribute('for', `${guest.firstName}${guest.lastName}rsvpYes`);
      rsvpYesWrapper.appendChild(rsvpYes);
      rsvpYesWrapper.appendChild(rsvpYesLabel);

      const rsvpNoWrapper = document.createElement('div');
      rsvpNoWrapper.className = 'RSVPOptionGroup';
      const rsvpNo = document.createElement('input');
      rsvpNo.type = 'radio';
      rsvpNo.name = `${guest.firstName}${guest.lastName}rsvp`;
      rsvpNo.id = `${guest.firstName}${guest.lastName}rsvpNo`;
      rsvpNo.value = false;
      const rsvpNoLabel = document.createElement('label');
      rsvpNoLabel.innerText = 'no';
      rsvpNoLabel.setAttribute('for', `${guest.firstName}${guest.lastName}rsvpNo`);
      rsvpNoLabel.className = `${guest.firstName}${guest.lastName}rsvpNo`;
      rsvpNoWrapper.appendChild(rsvpNo);
      rsvpNoWrapper.appendChild(rsvpNoLabel);

      function toggleRSVPForm(display) {
        if (display) {
          const wrapper = document.createElement('div');
          wrapper.className = `${guest.firstName}${guest.lastName}subsection`;

          const dietaryRestrictions = generateDietaryRestrictions(`${guest.firstName}${guest.lastName}dietaryRestrictions`);
          const brunch = generateBrunch(`${guest.firstName}${guest.lastName}brunch`);

          if (!guest.isChild) {
            const meal = generateMealSelect(`${guest.firstName}${guest.lastName}meal`);
            wrapper.appendChild(meal);
          }
          wrapper.appendChild(dietaryRestrictions);
          wrapper.appendChild(brunch);
          if (!guest.isChild) {
            const transportation = generateTransportation(`${guest.firstName}${guest.lastName}transportation`);
            wrapper.appendChild(transportation);
          }

          if (guest.hasPlusOne) {
            const plusOneLabel = document.createElement('label');
            plusOneLabel.innerText = 'Will you need a +1?';
            plusOneLabel.className = 'RSVPLabel';

            const plusOneRadioWrapper = document.createElement('div');
            plusOneRadioWrapper.className = 'RSVPOptionGroup';
            const plusOneRadio = document.createElement('input');
            const plusOneRadioLabel = document.createElement('label');
            plusOneRadioLabel.innerText = 'yes';
            plusOneRadioLabel.setAttribute('for', `${guest.firstName}${guest.lastName}yesPlusOne`);
            plusOneRadio.type = 'radio';
            plusOneRadio.name = `${guest.firstName}${guest.lastName}plusOne`;
            plusOneRadio.id = `${guest.firstName}${guest.lastName}yesPlusOne`;
            plusOneRadio.value = true;
            plusOneRadioWrapper.appendChild(plusOneRadio);
            plusOneRadioWrapper.appendChild(plusOneRadioLabel);

            const noPlusOneRadioWrapper = document.createElement('div');
            noPlusOneRadioWrapper.className = 'RSVPOptionGroup';
            const noPlusOneRadio = document.createElement('input');
            const noPlusOneRadioLabel = document.createElement('label');
            noPlusOneRadioLabel.innerText = 'no';
            noPlusOneRadioLabel.setAttribute('for', `${guest.firstName}${guest.lastName}noPlusOne`);
            noPlusOneRadio.type = 'radio';
            noPlusOneRadio.name = `${guest.firstName}${guest.lastName}plusOne`;
            noPlusOneRadio.id = `${guest.firstName}${guest.lastName}noPlusOne`;
            noPlusOneRadio.value = false;
            noPlusOneRadioWrapper.appendChild(noPlusOneRadio);
            noPlusOneRadioWrapper.appendChild(noPlusOneRadioLabel);

            const plusOneWrapper = document.createElement('div');

            function togglePlusOneInput(display) {
              if (display) {
                const plusOneHeader = document.createElement('h1');
                plusOneHeader.innerText = 'Your +1';

                const plusOneNameLabel = document.createElement('label');
                plusOneNameLabel.innerText = 'Name of your +1';
                plusOneNameLabel.setAttribute('for', `${guest.firstName}${guest.lastName}plusOneName`);
                plusOneNameLabel.className = 'RSVPLabel';
                const plusOneName = document.createElement('input');
                plusOneName.className = 'RSVPInput';
                plusOneName.name = `${guest.firstName}${guest.lastName}plusOneName`;
                plusOneName.id = `${guest.firstName}${guest.lastName}plusOneName`;
                plusOneName.placeholder = 'name';

                const plustOneMeal = generateMealSelect(`${guest.firstName}${guest.lastName}plusOneMeal`);
                const plustOneDietaryRestrictions = generateDietaryRestrictions(`${guest.firstName}${guest.lastName}plusOneDietaryRestrictions`);
                const plustOneBrunch = generateBrunch(`${guest.firstName}${guest.lastName}plusOneBrunch`);
                const plustOneTransportation = generateTransportation(`${guest.firstName}${guest.lastName}plusOneTransportation`);

                plusOneWrapper.appendChild(plusOneHeader);
                plusOneWrapper.appendChild(plusOneNameLabel);
                plusOneWrapper.appendChild(plusOneName);
                plusOneWrapper.appendChild(plustOneMeal);
                plusOneWrapper.appendChild(plustOneDietaryRestrictions);
                plusOneWrapper.appendChild(plustOneBrunch);
                plusOneWrapper.appendChild(plustOneTransportation);
              } else {
                while(plusOneWrapper.firstChild) {
                  plusOneWrapper.removeChild(plusOneWrapper.firstChild);
                }
              }
            }

            plusOneRadio.onchange = function(e) {
              togglePlusOneInput(true);
            }

            noPlusOneRadio.onchange = function(e) {
              togglePlusOneInput(false);
            }

            const needsPlusOneWrapper = document.createElement('div');
            needsPlusOneWrapper.className = 'RSVPInputSection';
            needsPlusOneWrapper.appendChild(plusOneLabel);
            needsPlusOneWrapper.appendChild(plusOneRadioWrapper);
            needsPlusOneWrapper.appendChild(noPlusOneRadioWrapper);
            needsPlusOneWrapper.appendChild(plusOneWrapper);
            wrapper.appendChild(needsPlusOneWrapper);
          }

          if (rsvpNoWrapper.nextSibling) {
            form.insertBefore(wrapper, rsvpNoWrapper.nextSibling);
          } else {
            form.appendChild(wrapper);
          }
        } else {
          if (form.querySelector(`.${guest.firstName}${guest.lastName}subsection`)) {
            form.removeChild(form.querySelector(`.${guest.firstName}${guest.lastName}subsection`));
          }
        }

        if (form.querySelector('.RSVPButton')) {
          form.removeChild(form.querySelector('.RSVPButton'));
        }

        const submit = document.createElement('button');
        submit.innerText = 'Submit RSVP';
        submit.className = 'RSVPButton';
        form.appendChild(submit);
      }

      rsvpYes.onchange = function(e) {
        toggleRSVPForm(true);
      }

      rsvpNo.onchange = function(e) {
        toggleRSVPForm(false);
      }

      form.appendChild(rsvpLabel);
      form.appendChild(rsvpYesWrapper);
      form.appendChild(rsvpNoWrapper);
    });

    rsvpResultsNode.appendChild(form);
  }

  // generator functions
  function generateMealSelect(key) {
    const wrapper = document.createElement('div');
    wrapper.className = 'RSVPInputSection';
    const label = document.createElement('label');
    label.innerText = 'Please choose a meal';
    label.className = 'RSVPLabel';

    const beefWrapper = document.createElement('div');
    beefWrapper.className = 'RSVPOptionGroup';
    const beef = document.createElement('input');
    beef.type = 'radio';
    beef.name = key;
    beef.id = `${key}beef`;
    beef.value = 'beef';
    const beefLabel = document.createElement('label');
    beefLabel.innerText = 'Duo of Beef';
    beefLabel.setAttribute('for', `${key}beef`);
    beefWrapper.appendChild(beef);
    beefWrapper.appendChild(beefLabel);

    const halibutWrapper = document.createElement('div');
    halibutWrapper.className = 'RSVPOptionGroup';
    const halibut = document.createElement('input');
    halibut.type = 'radio';
    halibut.name = key;
    halibut.id = `${key}halibut`;
    halibut.value = 'halibut';
    const halibutLabel = document.createElement('label');
    halibutLabel.innerText = 'Herb-Crusted Halibut';
    halibutLabel.setAttribute('for', `${key}halibut`);
    halibutWrapper.appendChild(halibut);
    halibutWrapper.appendChild(halibutLabel);

    const lasagnaWrapper = document.createElement('div');
    lasagnaWrapper.className = 'RSVPOptionGroup';
    const lasagna = document.createElement('input');
    lasagna.type = 'radio';
    lasagna.name = key;
    lasagna.id = `${key}lasagna`;
    lasagna.value = 'lasagna';
    const lasagnaLabel = document.createElement('label');
    lasagnaLabel.innerText = 'Roasted Vegetable Lasagna (vegetarian)';
    lasagnaLabel.setAttribute('for', `${key}lasagna`);
    lasagnaWrapper.appendChild(lasagna);
    lasagnaWrapper.appendChild(lasagnaLabel);

    const quinoaWrapper = document.createElement('div');
    quinoaWrapper.className = 'RSVPOptionGroup';
    const quinoa = document.createElement('input');
    quinoa.type = 'radio';
    quinoa.name = key;
    quinoa.id = `${key}quinoa`;
    quinoa.value = 'quinoa';
    const quinoaLabel = document.createElement('label');
    quinoaLabel.innerText = 'Red Quinoa and Roasted Seasonal Vegetables (vegan)';
    quinoaLabel.setAttribute('for', `${key}quinoa`);
    quinoaWrapper.appendChild(quinoa);
    quinoaWrapper.appendChild(quinoaLabel);

    wrapper.appendChild(label);

    wrapper.appendChild(beefWrapper);
    wrapper.appendChild(halibutWrapper);
    wrapper.appendChild(lasagnaWrapper);
    wrapper.appendChild(quinoaWrapper);

    return wrapper;
  }

  function generateDietaryRestrictions(key) {
    const wrapper = document.createElement('div');
    wrapper.className = 'RSVPInputSection';
    const label = document.createElement('label');
    label.innerText = 'Do you have any dietary restrictions?';
    label.setAttribute('for', key);
    label.className = 'RSVPLabel';

    const input = document.createElement('input');
    input.className = 'RSVPInput';
    input.placeholder = 'dietary restrictions (optional)';
    input.name = key;
    input.id = key;

    wrapper.appendChild(label);
    wrapper.appendChild(input);
    return wrapper;
  }

  function generateBrunch(key) {
    const wrapper = document.createElement('div');
    wrapper.className = 'RSVPInputSection';
    const label = document.createElement('label');
    label.innerText = 'Do you expect to come to Sunday brunch?';
    label.className = 'RSVPLabel';

    const rsvpYesWrapper = document.createElement('div');
    rsvpYesWrapper.className = 'RSVPOptionGroup';
    const yesLabel = document.createElement('label');
    yesLabel.innerText = 'yes';
    yesLabel.setAttribute('for', `${key}yes`);
    const yes = document.createElement('input');
    yes.type = 'radio';
    yes.name = key;
    yes.id = `${key}yes`;
    yes.value = true;
    rsvpYesWrapper.appendChild(yes);
    rsvpYesWrapper.appendChild(yesLabel);

    const rsvpNoWrapper = document.createElement('div');
    rsvpNoWrapper.className = 'RSVPOptionGroup';
    const noLabel = document.createElement('label');
    noLabel.innerText = 'no';
    noLabel.setAttribute('for', `${key}no`);
    const no = document.createElement('input');
    no.type = 'radio';
    no.name = key;
    no.id = `${key}no`;
    no.value = false;
    rsvpNoWrapper.appendChild(no);
    rsvpNoWrapper.appendChild(noLabel);

    wrapper.appendChild(label);
    wrapper.appendChild(rsvpYesWrapper);
    wrapper.appendChild(rsvpNoWrapper);
    return wrapper;
  }

  function generateTransportation(key) {
    const wrapper = document.createElement('div');
    wrapper.className = 'RSVPInputSection';
    const label = document.createElement('label');
    label.innerText = 'Would you be interested in any of the following transportation options if we provided them?';
    label.className = 'RSVPLabel';

    const hotelWrapper = document.createElement('div');
    hotelWrapper.className = 'RSVPOptionGroup';
    const hotelLabel = document.createElement('label');
    hotelLabel.innerText = 'shuttle to/from hotel to venue';
    hotelLabel.setAttribute('for', `${key}hotel`);
    const hotel = document.createElement('input');
    hotel.type = 'checkbox';
    hotel.id = `${key}hotel`;
    hotel.name = `${key}hotel`;
    hotelWrapper.appendChild(hotel);
    hotelWrapper.appendChild(hotelLabel);

    const trainWrapper = document.createElement('div');
    trainWrapper.className = 'RSVPOptionGroup';
    const trainLabel = document.createElement('label');
    trainLabel.innerText = 'shuttle to/from local train station';
    trainLabel.setAttribute('for', `${key}train`);
    const train = document.createElement('input');
    train.type = 'checkbox';
    train.id = `${key}train`;
    train.name = `${key}train`;
    trainWrapper.appendChild(train);
    trainWrapper.appendChild(trainLabel);

    const midtownWrapper = document.createElement('div');
    midtownWrapper.className = 'RSVPOptionGroup';
    const midtownLabel = document.createElement('label');
    midtownLabel.innerText = 'shuttle to/from NYC midtown';
    midtownLabel.setAttribute('for', `${key}midtown`);
    const midtown = document.createElement('input');
    midtown.type = 'checkbox';
    midtown.id = `${key}midtown`;
    midtown.name = `${key}midtown`;
    midtownWrapper.appendChild(midtown);
    midtownWrapper.appendChild(midtownLabel);

    wrapper.appendChild(label);
    wrapper.appendChild(hotelWrapper);
    wrapper.appendChild(trainWrapper);
    wrapper.appendChild(midtownWrapper);
    return wrapper;
  }
}
