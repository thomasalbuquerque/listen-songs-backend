export interface I18nTranslations {
  translation: {
    code: string;
    firstName: string;
    lastName: string;
    idCard: string;
    birthDate: string;
    phone: string;
    zipCode: string;
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    country: string;
    email: string;
    password: string;
    deviceId: string;
    os: string;
    deviceOS: string;
    songIds: string;
    devSecret: string;
    title: string;
    description: string;
    songsChunk: string;
    ticketPriceBrl: string;
    awards: string;
    status: string;
    startedAt: string;
    finishedAt: string;
    ticketAmount: string;
    winnerPosition: string;
    paymentAt: string;
    limit: string;
    offset: string;
    wallet: string;
    amount: string;
    playlistIdSpotify: string;
    playlistName: string;
    playlistOwner: string;
    firebaseToken: string;
    language: string;
    songIdSpotify: string;
    seconds: string;
    giveToken: string;
    giveYupoints: string;
    tokenBrl: string;
    referrerCode: string;
    username: string;
    oldPassword: string;
    priceToken: string;
    priceYupoints: string;
  };
  validation: {
    is_string: string;
    is_number: string;
    is_int: string;
    is_date: string;
    is_boolean: string;
    is_not_empty: string;
    is_email: string;
    is_in: string;
    is_username: string;
    is_strong_password: string;
    length: string;
    min_length: string;
    is_array: string;
    each_is_string: string;
    each_is_uuid: string;
    is_enum: string;
    is_iso_date_string: string;
    is_ethereum_address: string;
    is_decimal: string;
    is_bigint: string;
    is_phone_number: string;
    min: string;
  };
  auth: {
    invalid_email_or_password: string;
    user_blocked: string;
    invalid_user: string;
    invalid_code: string;
    invalid_email: string;
    wrong_device_id: string;
    logged_out: string;
    email_was_sent: string;
    email_was_not_sent: string;
    email_confirmed: string;
    email_already_confirmed: string;
    password_reset: string;
    access_denied: string;
    token: {
      not_found: string;
      invalid: string;
    };
    refresh_token: {
      not_found: string;
      invalid: string;
    };
  };
  user: {
    not_found: string;
    already_connected: string;
    spotify_linked: string;
    spotify_already_linked: string;
    spotify_disconnected: string;
    invalid: string;
    invalid_email: string;
    invalid_spotify_code: string;
    not_allowed: string;
    must_provide_old_password_to_update_password: string;
    new_email_cannot_be_the_same: string;
    new_username_cannot_be_the_same: string;
    new_password_cannot_be_the_same: string;
    invalid_password: string;

    wallet: {
      does_not_have: string;
    };
  };
  personal_data: {
    not_found: string;
    already_exists_for_user: string;
    phone_not_verified: string;
    phone_already_verified: string;

    sms: {
      sent_successfully: string;
      already_sent: string;
      sent_exceeded: string;
      attempts_exceeded: string;
      error_sending: string;
      attempts_for_this_sms_exceeded: string;
      invalid_code: string;
      error_more_than_2_sms_in_7_days: string;
      error_no_successful_sms_in_7_days: string;
    };
  };
  address: {
    not_found: string;
  };
  rules: {
    title1: string;
    content1: string;
    title2: string;
    content2: string;
    title3: string;
    content3: string;
    title4: string;
    content4: string;
  };
  payment_data: {
    not_found: string;
    insufficient_funds: string;
    insufficient_balance: string;
    already_exists_for_this_user: string;

    withdraw: {
      withdraws_not_found: string;
      error_calculating_tax: string;
      error_while_performing_withdraw: string;
      push_notification: {
        success: {
          title: string;
          body: string;
        };
      };
    };
  };
  campaign: {
    campaigns_not_found: string;
    not_found: string;

    ticket: {
      tickets_not_found: string;
      not_found: string;
    };

    winner: {
      winners_not_found: string;
      not_found: string;
      already_exists: string;
    };
  };
  draw_product: {
    draw_products_not_found: string;
    not_found: string;

    ticket: {
      tickets_not_found: string;
      not_found: string;
    };

    winner: {
      winners_not_found: string;
      not_found: string;
      already_exists: string;
    };
  };
  song: {
    not_found: string;
    already_exists: string;
    some_songs_not_found: string;
  };
  heard_song: {
    heard_songs_not_found: string;
  };

  playlist: {
    not_found: string;
    already_exists: string;
  };

  settings: {
    not_found: string;

    mobile: {
      not_found: string;
    };
  };
  file: {
    no_file_uploaded: string;
    maximum_size_10mb: string;
  };
  stories: {
    not_found: string;
    maximum_10_per_day: string;
  };
}
